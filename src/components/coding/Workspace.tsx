import React from 'react';
import { CodeBlock, BlockType } from '../../types';
import { sounds } from '../../utils/audio';
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  CornerDownRight, 
  Plus, 
  FastForward,
  CheckCircle2
} from 'lucide-react';

interface WorkspaceProps {
  blocks: CodeBlock[];
  onUpdateBlocks: (blocks: CodeBlock[]) => void;
  isRunning: boolean;
  onRun: () => void;
  onStep: () => void;
  onReset: () => void;
  onClear: () => void;
  executingBlockId: string | null;
  targetContainerId: string | null;
  onSelectContainer: (id: string | null) => void;
  maxBlocks?: number;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  blocks,
  onUpdateBlocks,
  isRunning,
  onRun,
  onStep,
  onReset,
  onClear,
  executingBlockId,
  targetContainerId,
  onSelectContainer,
  maxBlocks,
}) => {
  // Count total blocks recursively
  const countBlocks = (list: CodeBlock[]): number => {
    return list.reduce((acc, b) => {
      let count = 1;
      if (b.children) count += countBlocks(b.children);
      return acc + count;
    }, 0);
  };

  const totalBlockCount = countBlocks(blocks);

  // Helper: Delete block by ID recursively
  const deleteBlock = (id: string) => {
    sounds.playEraser();
    const removeRecursive = (list: CodeBlock[]): CodeBlock[] => {
      return list
        .filter((b) => b.id !== id)
        .map((b) => {
          if (b.children) {
            return { ...b, children: removeRecursive(b.children) };
          }
          return b;
        });
    };
    onUpdateBlocks(removeRecursive(blocks));
    if (targetContainerId === id) {
      onSelectContainer(null);
    }
  };

  // Helper: Move block up or down at top-level
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    sounds.playUndo();
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    onUpdateBlocks(newBlocks);
  };

  // Helper: Update repeat count
  const setRepeatCount = (id: string, count: number) => {
    sounds.playSnap();
    const updateRecursive = (list: CodeBlock[]): CodeBlock[] => {
      return list.map((b) => {
        if (b.id === id) {
          return { ...b, repeatCount: count };
        }
        if (b.children) {
          return { ...b, children: updateRecursive(b.children) };
        }
        return b;
      });
    };
    onUpdateBlocks(updateRecursive(blocks));
  };

  // Helper to remove child block inside a container
  const removeChildBlock = (containerId: string, childId: string) => {
    sounds.playEraser();
    const updateRecursive = (list: CodeBlock[]): CodeBlock[] => {
      return list.map((b) => {
        if (b.id === containerId && b.children) {
          return { ...b, children: b.children.filter((c) => c.id !== childId) };
        }
        if (b.children) {
          return { ...b, children: updateRecursive(b.children) };
        }
        return b;
      });
    };
    onUpdateBlocks(updateRecursive(blocks));
  };

  // Recursive renderer for an individual block
  const renderBlock = (b: CodeBlock, index: number, isChild: boolean = false, parentId?: string) => {
    const isExecuting = executingBlockId === b.id;
    const isSelectedContainer = targetContainerId === b.id;

    if (b.type === 'repeat') {
      return (
        <div
          key={b.id}
          className={`rounded-xl border-2 transition-all p-2.5 space-y-2 select-none ${
            isExecuting
              ? 'border-yellow-400 bg-amber-100 shadow-md ring-4 ring-yellow-300 animate-pulse'
              : isSelectedContainer
              ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-300'
              : 'border-amber-400 bg-amber-500/10'
          }`}
        >
          {/* Repeat Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900">
              <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-xs">반복</span>
              <select
                value={b.repeatCount || 2}
                onChange={(e) => setRepeatCount(b.id, parseInt(e.target.value, 10))}
                className="bg-white border border-amber-300 text-amber-950 font-bold px-1.5 py-0.5 rounded text-xs cursor-pointer focus:ring-2 focus:ring-amber-500"
              >
                {[2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <span>번 반복하기</span>
            </div>

            <div className="flex items-center gap-1">
              {!isChild ? (
                <>
                  <button
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    title="위로 이동"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    title="아래로 이동"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteBlock(b.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                parentId && (
                  <button
                    onClick={() => removeChildBlock(parentId, b.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Children Slot (Indented like Scratch) */}
          <div className="ml-3 pl-3 border-l-4 border-amber-400 space-y-2 min-h-12 py-1">
            {b.children && b.children.length > 0 ? (
              b.children.map((child, cIdx) => renderBlock(child, cIdx, true, b.id))
            ) : (
              <div className="text-[11px] text-amber-700/80 italic p-2 border border-dashed border-amber-300 rounded-lg text-center bg-white/60">
                반복할 블록을 보관함에서 골라 넣어주세요!
              </div>
            )}

            {/* Target Container Select Button */}
            <button
              onClick={() => onSelectContainer(isSelectedContainer ? null : b.id)}
              className={`w-full py-1 text-[11px] font-bold rounded border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                isSelectedContainer
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white hover:bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              <Plus className="w-3 h-3" />
              <span>{isSelectedContainer ? '반복문 안에 넣기 선택됨' : '반복문 안에 블록 넣기'}</span>
            </button>
          </div>

          <div className="text-[10px] font-bold text-amber-700 text-right pr-2">
            반복 끝 🔚
          </div>
        </div>
      );
    }

    if (b.type === 'if_path' || b.type === 'if_obstacle' || b.type === 'if_item') {
      const conditionLabel =
        b.type === 'if_path'
          ? '만약 앞에 길이 있으면'
          : b.type === 'if_item'
          ? '만약 여기에 아이템이 있으면 💎'
          : '만약 앞에 장애물이 있으면';

      return (
        <div
          key={b.id}
          className={`rounded-xl border-2 transition-all p-2.5 space-y-2 select-none ${
            isExecuting
              ? 'border-yellow-400 bg-yellow-100 shadow-md ring-4 ring-yellow-300 animate-pulse'
              : isSelectedContainer
              ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-300'
              : 'border-yellow-400 bg-yellow-500/10'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-yellow-950">
              <span className="bg-yellow-500 text-slate-900 px-2 py-0.5 rounded text-xs">조건</span>
              <span>{conditionLabel}</span>
            </div>

            <div className="flex items-center gap-1">
              {!isChild ? (
                <>
                  <button
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteBlock(b.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                parentId && (
                  <button
                    onClick={() => removeChildBlock(parentId, b.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Children Slot */}
          <div className="ml-3 pl-3 border-l-4 border-yellow-400 space-y-1.5 min-h-10 py-1">
            {b.children && b.children.length > 0 ? (
              b.children.map((child, cIdx) => renderBlock(child, cIdx, true, b.id))
            ) : (
              <div className="text-[11px] text-yellow-800 italic p-2 border border-dashed border-yellow-300 rounded-lg text-center bg-white/60">
                조건이 맞을 때 실행할 블록(예: 아이템 줍기, 돌기)을 넣어주세요!
              </div>
            )}

            <button
              onClick={() => onSelectContainer(isSelectedContainer ? null : b.id)}
              className={`w-full py-1 text-[11px] font-bold rounded border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                isSelectedContainer
                  ? 'bg-yellow-500 text-slate-900 border-yellow-600 font-extrabold'
                  : 'bg-white hover:bg-yellow-50 text-yellow-900 border-yellow-300'
              }`}
            >
              <Plus className="w-3 h-3" />
              <span>{isSelectedContainer ? '조건문 안에 넣기 선택됨' : '조건문 안에 블록 넣기'}</span>
            </button>
          </div>
        </div>
      );
    }

    // Action Block: collect_item
    if (b.type === 'collect_item') {
      return (
        <div
          key={b.id}
          className={`p-2.5 rounded-xl border flex items-center justify-between shadow-xs select-none transition-all ${
            isExecuting
              ? 'bg-yellow-400 text-slate-900 border-yellow-500 ring-4 ring-yellow-300 shadow-lg scale-102 font-extrabold animate-pulse'
              : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-650'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">💎</span>
            <span className="text-xs sm:text-sm font-bold">아이템 줍기</span>
          </div>

          <div className="flex items-center gap-1">
            {!isChild ? (
              <>
                <button
                  onClick={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-white/70 hover:text-white disabled:opacity-20 cursor-pointer"
                  title="위로 이동"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                  className="p-1 text-white/70 hover:text-white disabled:opacity-20 cursor-pointer"
                  title="아래로 이동"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteBlock(b.id)}
                  className="p-1 text-white/70 hover:text-red-200 hover:bg-red-500/30 rounded cursor-pointer"
                  title="삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              parentId && (
                <button
                  onClick={() => removeChildBlock(parentId, b.id)}
                  className="p-1 text-white/70 hover:text-red-200 hover:bg-red-500/30 rounded cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>
        </div>
      );
    }

    // Motion Blocks (Move, Turn Left, Turn Right)
    return (
      <div
        key={b.id}
        className={`p-2.5 rounded-xl border flex items-center justify-between shadow-xs select-none transition-all ${
          isExecuting
            ? 'bg-yellow-400 text-slate-900 border-yellow-500 ring-4 ring-yellow-300 shadow-lg scale-102 font-extrabold animate-pulse'
            : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-650'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold">
            {b.type === 'move' && '앞으로 한 칸 걷기'}
            {b.type === 'turn_right' && '오른쪽으로 돌기 ↻'}
            {b.type === 'turn_left' && '왼쪽으로 돌기 ↺'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {!isChild ? (
            <>
              <button
                onClick={() => moveBlock(index, 'up')}
                disabled={index === 0}
                className="p-1 text-white/70 hover:text-white disabled:opacity-20 cursor-pointer"
                title="위로 이동"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveBlock(index, 'down')}
                disabled={index === blocks.length - 1}
                className="p-1 text-white/70 hover:text-white disabled:opacity-20 cursor-pointer"
                title="아래로 이동"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteBlock(b.id)}
                className="p-1 text-white/70 hover:text-red-200 hover:bg-red-500/30 rounded cursor-pointer"
                title="삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            parentId && (
              <button
                onClick={() => removeChildBlock(parentId, b.id)}
                className="p-1 text-white/70 hover:text-red-200 hover:bg-red-500/30 rounded cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3 flex flex-col h-full">
      {/* Workspace Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span>📝 내 코딩 작업 공간</span>
          </h3>
          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
            <span>사용한 블록: <strong>{totalBlockCount}개</strong></span>
            {maxBlocks && (
              <span className={totalBlockCount <= maxBlocks ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                (추천: {maxBlocks}개 이하)
              </span>
            )}
          </div>
        </div>

        {/* Clear Workspace */}
        {blocks.length > 0 && (
          <button
            onClick={() => {
              sounds.playUndo();
              onClear();
            }}
            disabled={isRunning}
            className="text-[11px] text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 p-1 hover:bg-red-50 rounded cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>비우기</span>
          </button>
        )}
      </div>

      {/* Assembly List Area */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-64 p-1 bg-slate-50/70 rounded-xl border border-slate-100">
        {/* Scratch Start Flag Header Block */}
        <div className="p-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs border border-emerald-700">
          <span className="text-sm">🚩</span>
          <span>[시작하기]를 클릭했을 때</span>
        </div>

        {/* User Assembled Blocks */}
        {blocks.length > 0 ? (
          blocks.map((b, idx) => renderBlock(b, idx))
        ) : (
          <div className="py-12 px-4 text-center text-slate-400 text-xs space-y-2">
            <div className="text-3xl">🧩</div>
            <p className="font-medium text-slate-600">아직 조립된 블록이 없어요.</p>
            <p className="text-[11px] text-slate-400">
              왼쪽의 <strong>[블록 보관함]</strong>에서 블록을 클릭해 여기에 쌓아보세요!
            </p>
          </div>
        )}
      </div>

      {/* Execution Control Action Bar */}
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Run All Button */}
          <button
            onClick={onRun}
            disabled={blocks.length === 0}
            className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer ${
              isRunning
                ? 'bg-amber-500 text-white animate-pulse'
                : blocks.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunning ? '실행 중...' : '시작하기'}</span>
          </button>

          {/* Step Button */}
          <button
            onClick={onStep}
            disabled={isRunning || blocks.length === 0}
            className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
              blocks.length === 0
                ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
            }`}
            title="한 번 누를 때마다 한 블록씩 실행"
          >
            <FastForward className="w-4 h-4" />
            <span>한 걸음씩</span>
          </button>
        </div>

        {/* Reset Character */}
        <button
          onClick={onReset}
          className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>처음 위치로 되돌리기</span>
        </button>
      </div>
    </div>
  );
};
