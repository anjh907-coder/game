import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MissionLevel, CodeBlock, BlockType, Direction } from '../../types';
import { MISSIONS } from '../../utils/missions';
import { gridToDataUrl } from '../../utils/spriteHelper';
import { sounds } from '../../utils/audio';
import { GridStage } from './GridStage';
import { BlockPalette } from './BlockPalette';
import { Workspace } from './Workspace';
import { LevelHeader } from './LevelHeader';
import { SuccessModal } from './SuccessModal';

interface CodingAdventureProps {
  pixelGrid: string[][];
  onGoToPixelArt: () => void;
}

interface ActionStep {
  type: 'move' | 'turn_right' | 'turn_left' | 'bump' | 'goal' | 'collect';
  blockId: string;
  x: number;
  y: number;
  dir: Direction;
  itemKey?: string;
  message?: string;
}

export const CodingAdventure: React.FC<CodingAdventureProps> = ({
  pixelGrid,
  onGoToPixelArt,
}) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const currentLevel: MissionLevel = MISSIONS[currentLevelIndex];

  // Block programs saved per level
  const [levelPrograms, setLevelPrograms] = useState<Record<number, CodeBlock[]>>({});
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Current level blocks
  const blocks = levelPrograms[currentLevel.id] || [];

  // Player live state
  const [playerX, setPlayerX] = useState<number>(currentLevel.startX);
  const [playerY, setPlayerY] = useState<number>(currentLevel.startY);
  const [playerDir, setPlayerDir] = useState<Direction>(currentLevel.startDir);
  const [isBumping, setIsBumping] = useState<boolean>(false);
  const [collectedItemKeys, setCollectedItemKeys] = useState<string[]>([]);

  // Execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executingBlockId, setExecutingBlockId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'idle' | 'running' | 'success' | 'fail'>('idle');
  const [isSuccessOpen, setIsSuccessOpen] = useState<boolean>(false);

  // Target container for nested block additions
  const [targetContainerId, setTargetContainerId] = useState<string | null>(null);

  // Player sprite data URL derived from Tab 1
  const [playerSpriteUrl, setPlayerSpriteUrl] = useState<string>(() => gridToDataUrl(pixelGrid, 128));

  useEffect(() => {
    const url = gridToDataUrl(pixelGrid, 128);
    setPlayerSpriteUrl(url);
  }, [pixelGrid]);

  // Reset character to start when level changes
  const resetCharacter = useCallback(() => {
    setPlayerX(currentLevel.startX);
    setPlayerY(currentLevel.startY);
    setPlayerDir(currentLevel.startDir);
    setIsBumping(false);
    setIsRunning(false);
    setExecutingBlockId(null);
    setStatusMessage(null);
    setStatusType('idle');
    setCollectedItemKeys([]);
  }, [currentLevel]);

  useEffect(() => {
    resetCharacter();
    setTargetContainerId(null);
  }, [currentLevelIndex, resetCharacter]);

  // Update blocks for current level
  const handleUpdateBlocks = (newBlocks: CodeBlock[]) => {
    setLevelPrograms((prev) => ({
      ...prev,
      [currentLevel.id]: newBlocks,
    }));
  };

  // Add block to workspace or nested container
  const handleAddBlock = (type: BlockType) => {
    const isContainer = type === 'repeat' || type === 'if_path' || type === 'if_obstacle' || type === 'if_item';
    const newBlock: CodeBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      repeatCount: type === 'repeat' ? (currentLevel.id === 8 ? 16 : 4) : undefined,
      children: isContainer ? [] : undefined,
    };

    if (targetContainerId) {
      // Add into targeted container
      const addRecursive = (list: CodeBlock[]): CodeBlock[] => {
        return list.map((b) => {
          if (b.id === targetContainerId && b.children) {
            return { ...b, children: [...b.children, newBlock] };
          }
          if (b.children) {
            return { ...b, children: addRecursive(b.children) };
          }
          return b;
        });
      };
      handleUpdateBlocks(addRecursive(blocks));
    } else {
      // Add to top-level
      handleUpdateBlocks([...blocks, newBlock]);
    }
  };

  // Helper to check what is in front of the player
  const checkFrontTile = (x: number, y: number, dir: Direction) => {
    const dx = dir === 1 ? 1 : dir === 3 ? -1 : 0;
    const dy = dir === 2 ? 1 : dir === 0 ? -1 : 0;
    const nx = x + dx;
    const ny = y + dy;

    if (nx < 0 || nx >= currentLevel.gridWidth || ny < 0 || ny >= currentLevel.gridHeight) {
      return 'obstacle';
    }
    const tile = currentLevel.map[ny]?.[nx];
    if (tile === 'obstacle' || tile === 'grass') {
      return 'obstacle';
    }
    return 'path';
  };

  // Compile and trace execution sequence
  const generateActionSequence = (): ActionStep[] => {
    const steps: ActionStep[] = [];
    let curX = currentLevel.startX;
    let curY = currentLevel.startY;
    let curDir = currentLevel.startDir;
    let actionCount = 0;
    const simCollectedItems = new Set<string>();
    const totalItemsRequired = currentLevel.items?.length || 0;
    const MAX_ACTIONS = 160; // safety ceiling to prevent infinite loops

    const traceBlock = (b: CodeBlock): boolean => {
      if (actionCount >= MAX_ACTIONS) return true; // stop if infinite

      if (b.type === 'move') {
        actionCount++;
        const dx = curDir === 1 ? 1 : curDir === 3 ? -1 : 0;
        const dy = curDir === 2 ? 1 : curDir === 0 ? -1 : 0;
        const nextX = curX + dx;
        const nextY = curY + dy;

        // Check bounds
        const isOutOfBounds =
          nextX < 0 || nextX >= currentLevel.gridWidth || nextY < 0 || nextY >= currentLevel.gridHeight;
        const targetTile = isOutOfBounds ? 'grass' : currentLevel.map[nextY][nextX];

        if (isOutOfBounds || targetTile === 'obstacle' || targetTile === 'grass') {
          // Bump
          steps.push({
            type: 'bump',
            blockId: b.id,
            x: curX,
            y: curY,
            dir: curDir,
            message: '앗! 장애물이나 벽에 부딪혔어요. 방향을 확인해보세요!',
          });
          return true; // Stop simulation on bump
        }

        curX = nextX;
        curY = nextY;

        // Check goal
        if (curX === currentLevel.goalX && curY === currentLevel.goalY && actionCount > 0) {
          if (totalItemsRequired === 0 || simCollectedItems.size === totalItemsRequired) {
            steps.push({
              type: 'goal',
              blockId: b.id,
              x: curX,
              y: curY,
              dir: curDir,
              message: currentLevel.id === 8
                ? '5x5 보석 트랙을 완벽하게 완주하고 제자리로 돌아왔습니다! 최종 게임 클리어! 🎉'
                : '보물 상자에 도착했습니다! 미션 성공!',
            });
            return true; // Stop simulation on goal reached
          }
        }

        steps.push({
          type: 'move',
          blockId: b.id,
          x: curX,
          y: curY,
          dir: curDir,
        });
      } else if (b.type === 'turn_right') {
        actionCount++;
        curDir = ((curDir + 1) % 4) as Direction;
        steps.push({
          type: 'turn_right',
          blockId: b.id,
          x: curX,
          y: curY,
          dir: curDir,
        });
      } else if (b.type === 'turn_left') {
        actionCount++;
        curDir = ((curDir + 3) % 4) as Direction;
        steps.push({
          type: 'turn_left',
          blockId: b.id,
          x: curX,
          y: curY,
          dir: curDir,
        });
      } else if (b.type === 'collect_item') {
        actionCount++;
        const key = `${curX},${curY}`;
        const isItemAtTile = currentLevel.items?.some((it) => it.x === curX && it.y === curY);

        if (isItemAtTile && !simCollectedItems.has(key)) {
          simCollectedItems.add(key);
          steps.push({
            type: 'collect',
            blockId: b.id,
            x: curX,
            y: curY,
            dir: curDir,
            itemKey: key,
          });
        }

        // Check if collecting the last item at the goal position completes it!
        if (curX === currentLevel.goalX && curY === currentLevel.goalY && actionCount > 0) {
          if (totalItemsRequired > 0 && simCollectedItems.size === totalItemsRequired) {
            steps.push({
              type: 'goal',
              blockId: b.id,
              x: curX,
              y: curY,
              dir: curDir,
              message: currentLevel.id === 8
                ? '모든 보석을 모으고 제자리로 돌아왔습니다! 최종 미션 성공! 🎉'
                : '보물 상자에 도착했습니다! 미션 성공!',
            });
            return true;
          }
        }
      } else if (b.type === 'repeat') {
        const count = b.repeatCount || 2;
        for (let i = 0; i < count; i++) {
          if (b.children) {
            for (const child of b.children) {
              const shouldStop = traceBlock(child);
              if (shouldStop) return true;
            }
          }
        }
      } else if (b.type === 'if_item') {
        const key = `${curX},${curY}`;
        const isItemAtTile = currentLevel.items?.some((it) => it.x === curX && it.y === curY);
        const hasUncollectedItem = isItemAtTile && !simCollectedItems.has(key);

        if (hasUncollectedItem && b.children) {
          for (const child of b.children) {
            const shouldStop = traceBlock(child);
            if (shouldStop) return true;
          }
        }
      } else if (b.type === 'if_path') {
        const front = checkFrontTile(curX, curY, curDir);
        if (front === 'path' && b.children) {
          for (const child of b.children) {
            const shouldStop = traceBlock(child);
            if (shouldStop) return true;
          }
        }
      } else if (b.type === 'if_obstacle') {
        const front = checkFrontTile(curX, curY, curDir);
        if (front === 'obstacle' && b.children) {
          for (const child of b.children) {
            const shouldStop = traceBlock(child);
            if (shouldStop) return true;
          }
        }
      }

      return false;
    };

    for (const b of blocks) {
      const shouldStop = traceBlock(b);
      if (shouldStop) break;
    }

    return steps;
  };

  // Run full simulation timer
  const runTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleRun = () => {
    if (isRunning) {
      if (runTimerRef.current) clearInterval(runTimerRef.current);
      resetCharacter();
      return;
    }

    resetCharacter();
    const sequence = generateActionSequence();

    if (sequence.length === 0) {
      setStatusMessage('실행할 동작 블록이 없습니다. 블록을 조립해주세요!');
      setStatusType('fail');
      return;
    }

    setIsRunning(true);
    setStatusMessage('코드를 실행하고 있어요...');
    setStatusType('running');

    let stepIndex = 0;

    runTimerRef.current = setInterval(() => {
      if (stepIndex >= sequence.length) {
        if (runTimerRef.current) clearInterval(runTimerRef.current);
        setIsRunning(false);
        setExecutingBlockId(null);

        // Check if last step reached goal
        const last = sequence[sequence.length - 1];
        if (last && last.type === 'goal') {
          sounds.playSuccess();
          setStatusMessage(last.message || '목표에 도착했어요! 축하합니다!');
          setStatusType('success');
          setCompletedLevels((prev) =>
            prev.includes(currentLevel.id) ? prev : [...prev, currentLevel.id]
          );
          setIsSuccessOpen(true);
        } else if (last && last.type === 'bump') {
          sounds.playBump();
          setIsBumping(true);
          setTimeout(() => setIsBumping(false), 600);
          setStatusMessage(last.message || '앗! 벽에 부딪혔어요!');
          setStatusType('fail');
        } else {
          // Stopped midway without goal
          if (currentLevel.items && currentLevel.items.length > 0) {
            setStatusMessage('보석을 모두 모으거나 제자리 목표에 도착하지 못했습니다. 코드를 확인해보세요!');
          } else {
            setStatusMessage('목표에 아직 도착하지 못했어요. 블록을 더 연결해보세요!');
          }
          setStatusType('fail');
        }
        return;
      }

      const step = sequence[stepIndex];
      setExecutingBlockId(step.blockId);
      setPlayerX(step.x);
      setPlayerY(step.y);
      setPlayerDir(step.dir);

      if (step.type === 'move') {
        sounds.playStep();
      } else if (step.type === 'turn_right' || step.type === 'turn_left') {
        sounds.playTurn();
      } else if (step.type === 'collect') {
        sounds.playSuccess();
        if (step.itemKey) {
          setCollectedItemKeys((prev) => (prev.includes(step.itemKey!) ? prev : [...prev, step.itemKey!]));
        }
      } else if (step.type === 'bump') {
        sounds.playBump();
        setIsBumping(true);
      } else if (step.type === 'goal') {
        sounds.playSuccess();
      }

      stepIndex++;
    }, 380); // 380ms per step
  };

  // Single Step Runner
  const stepSeqRef = useRef<ActionStep[] | null>(null);
  const stepIndexRef = useRef<number>(0);

  const handleStep = () => {
    if (!stepSeqRef.current) {
      resetCharacter();
      stepSeqRef.current = generateActionSequence();
      stepIndexRef.current = 0;
    }

    const seq = stepSeqRef.current;
    if (stepIndexRef.current >= seq.length) {
      stepSeqRef.current = null;
      stepIndexRef.current = 0;
      setStatusMessage('모든 블록 실행 완료!');
      return;
    }

    const step = seq[stepIndexRef.current];
    setExecutingBlockId(step.blockId);
    setPlayerX(step.x);
    setPlayerY(step.y);
    setPlayerDir(step.dir);

    if (step.type === 'move') sounds.playStep();
    if (step.type === 'turn_right' || step.type === 'turn_left') sounds.playTurn();
    if (step.type === 'collect') {
      sounds.playSuccess();
      if (step.itemKey) {
        setCollectedItemKeys((prev) => (prev.includes(step.itemKey!) ? prev : [...prev, step.itemKey!]));
      }
    }
    if (step.type === 'bump') {
      sounds.playBump();
      setIsBumping(true);
      setStatusMessage(step.message || '벽에 부딪혔어요!');
      setStatusType('fail');
    }
    if (step.type === 'goal') {
      sounds.playSuccess();
      setStatusMessage(step.message || '목표 도착! 성공!');
      setStatusType('success');
      setCompletedLevels((prev) =>
        prev.includes(currentLevel.id) ? prev : [...prev, currentLevel.id]
      );
      setIsSuccessOpen(true);
    }

    stepIndexRef.current++;
  };

  const handleClearWorkspace = () => {
    handleUpdateBlocks([]);
    resetCharacter();
  };

  // Next level action
  const handleNextLevel = () => {
    setIsSuccessOpen(false);
    if (currentLevelIndex < MISSIONS.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-4">
      {/* 1. Level Header with Progress & Story */}
      <LevelHeader
        level={currentLevel}
        currentLevelIndex={currentLevelIndex}
        totalLevels={MISSIONS.length}
        completedLevels={completedLevels}
        onSelectLevel={(idx) => setCurrentLevelIndex(idx)}
      />

      {/* 2. Three-Zone Main Layout: [Grid Map] | [Toolbox] | [Workspace] */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Grid Map & Character (approx 4.5 cols on desktop) */}
        <section className="lg:col-span-4 xl:col-span-4 flex justify-center">
          <GridStage
            level={currentLevel}
            playerX={playerX}
            playerY={playerY}
            playerDir={playerDir}
            playerSpriteUrl={playerSpriteUrl}
            isBumping={isBumping}
            statusMessage={statusMessage}
            statusType={statusType}
            collectedItemKeys={collectedItemKeys}
          />
        </section>

        {/* Center: Block Toolbox (approx 3.5 cols on desktop) */}
        <section className="lg:col-span-3 xl:col-span-3">
          <BlockPalette
            allowedBlocks={currentLevel.allowedBlocks}
            onAddBlock={handleAddBlock}
            targetContainerId={targetContainerId}
          />
        </section>

        {/* Right: Workspace & Execution (approx 4-5 cols on desktop) */}
        <section className="lg:col-span-5 xl:col-span-5">
          <Workspace
            blocks={blocks}
            onUpdateBlocks={handleUpdateBlocks}
            isRunning={isRunning}
            onRun={handleRun}
            onStep={handleStep}
            onReset={resetCharacter}
            onClear={handleClearWorkspace}
            executingBlockId={executingBlockId}
            targetContainerId={targetContainerId}
            onSelectContainer={setTargetContainerId}
            maxBlocks={currentLevel.maxBlocks}
          />
        </section>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessOpen}
        levelNumber={currentLevel.id}
        isLastLevel={currentLevel.id === MISSIONS.length}
        blockCount={blocks.length}
        maxBlocks={currentLevel.maxBlocks}
        onNextLevel={handleNextLevel}
        onReplay={() => {
          setIsSuccessOpen(false);
          resetCharacter();
        }}
        onGoToPixelArt={() => {
          setIsSuccessOpen(false);
          onGoToPixelArt();
        }}
      />
    </div>
  );
};
