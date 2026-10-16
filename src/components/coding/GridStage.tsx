import React from 'react';
import { Direction, MissionLevel } from '../../types';

interface GridStageProps {
  level: MissionLevel;
  playerX: number;
  playerY: number;
  playerDir: Direction;
  playerSpriteUrl: string;
  isBumping: boolean;
  statusMessage: string | null;
  statusType: 'idle' | 'running' | 'success' | 'fail';
  collectedItemKeys: string[];
}

export const GridStage: React.FC<GridStageProps> = ({
  level,
  playerX,
  playerY,
  playerDir,
  playerSpriteUrl,
  isBumping,
  statusMessage,
  statusType,
  collectedItemKeys,
}) => {
  const { gridWidth, gridHeight, map, goalX, goalY, items } = level;
  const totalItems = items ? items.length : 0;
  const collectedCount = collectedItemKeys.length;

  const getRotationDeg = (dir: Direction) => {
    switch (dir) {
      case 0: return -90; // Up
      case 1: return 0;   // Right
      case 2: return 90;  // Down
      case 3: return 180; // Left
    }
  };

  const dirArrow = (dir: Direction) => {
    switch (dir) {
      case 0: return '⬆️';
      case 1: return '➡️';
      case 2: return '⬇️';
      case 3: return '⬅️';
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Stage Wrapper */}
      <div className="relative p-2.5 sm:p-3.5 bg-slate-800 rounded-2xl shadow-md border-2 border-slate-700 w-full max-w-[440px] aspect-square flex flex-col justify-center">
        {/* Top mini-bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="font-bold text-white">격자 맵 ({gridWidth}x{gridHeight})</span>
            {totalItems > 0 && (
              <span className="bg-amber-500/30 border border-amber-400/50 text-amber-200 px-1.5 py-0.2 rounded font-bold">
                💎 {collectedCount}/{totalItems}
              </span>
            )}
          </div>
          <div className="text-slate-400">
            위치: ({playerX}, {playerY}) · 방향: {dirArrow(playerDir)}
          </div>
        </div>

        {/* Map Grid Container */}
        <div
          className="relative w-full aspect-square bg-emerald-900 rounded-xl overflow-hidden border border-emerald-950 shadow-inner grid"
          style={{
            gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
          }}
        >
          {/* Tiles */}
          {map.map((row, rIdx) =>
            row.map((tile, cIdx) => {
              const isGoal = cIdx === goalX && rIdx === goalY;
              const isStart = cIdx === level.startX && rIdx === level.startY;
              const isPath = tile === 'path' || isGoal || isStart;
              const isObstacle = tile === 'obstacle';
              const itemKey = `${cIdx},${rIdx}`;
              const hasItem = items?.some((it) => it.x === cIdx && it.y === rIdx && !collectedItemKeys.includes(itemKey));

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`relative flex items-center justify-center border border-black/10 select-none transition-colors ${
                    isObstacle
                      ? 'bg-amber-950/80'
                      : isPath
                      ? 'bg-amber-100/90'
                      : 'bg-emerald-700/80'
                  }`}
                >
                  {/* Grass Tile detail */}
                  {!isPath && !isObstacle && (
                    <div className="text-emerald-500/40 text-[9px] select-none pointer-events-none">
                      🌱
                    </div>
                  )}

                  {/* Path subtle tile pattern */}
                  {isPath && !isGoal && !isStart && !hasItem && (
                    <div className="w-2 h-2 rounded-xs bg-amber-200/50" />
                  )}

                  {/* Start Point */}
                  {isStart && (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xs">🚩</span>
                      <span className="text-[8px] font-bold text-amber-800 leading-none">
                        {isStart && isGoal ? '출발/도착' : '출발'}
                      </span>
                    </div>
                  )}

                  {/* Goal Point (if different from start) */}
                  {isGoal && !isStart && (
                    <div className="flex flex-col items-center justify-center animate-bounce" style={{ animationDuration: '1.5s' }}>
                      <span className="text-xl sm:text-2xl drop-shadow-sm">🎁</span>
                      <span className="text-[9px] font-extrabold text-amber-900 bg-amber-300 px-1 rounded-sm leading-none shadow-xs">
                        보물
                      </span>
                    </div>
                  )}

                  {/* Collectible Gem/Item */}
                  {hasItem && (
                    <div className="flex flex-col items-center justify-center animate-pulse z-10">
                      <span className="text-base sm:text-lg drop-shadow-sm">💎</span>
                    </div>
                  )}

                  {/* Obstacle (Rock / Fire) */}
                  {isObstacle && (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-lg sm:text-xl drop-shadow-md">🪨</span>
                      <span className="text-[8px] font-bold text-red-200 leading-none">바위</span>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Active Player Character (Positioned absolutely based on grid coordinates) */}
          <div
            className={`absolute z-20 flex items-center justify-center transition-all duration-300 ease-out pointer-events-none ${
              isBumping ? 'animate-ping' : ''
            }`}
            style={{
              width: `${100 / gridWidth}%`,
              height: `${100 / gridHeight}%`,
              left: `${(playerX / gridWidth) * 100}%`,
              top: `${(playerY / gridHeight) * 100}%`,
            }}
          >
            <div className="relative w-4/5 h-4/5 flex items-center justify-center">
              {/* Character Sprite with rotation */}
              {playerSpriteUrl ? (
                <img
                  src={playerSpriteUrl}
                  alt="코딩 모험 플레이어"
                  className="w-full h-full object-contain pixelated drop-shadow-md transition-transform duration-300"
                  style={{
                    transform: `rotate(${getRotationDeg(playerDir)}deg)`,
                  }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-2xl transition-transform duration-300 select-none"
                  style={{
                    transform: `rotate(${getRotationDeg(playerDir)}deg)`,
                  }}
                >
                  👾
                </div>
              )}
              {/* Direction Indicator Arrow Badge */}
              <div className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-bold px-1 rounded-full shadow-xs border border-white">
                {dirArrow(playerDir)}
              </div>
            </div>
          </div>
        </div>

        {/* Status Bubble / Hint Feedback */}
        {statusMessage && (
          <div
            className={`mt-2.5 p-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              statusType === 'fail'
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-200'
                : statusType === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
                : 'bg-slate-700/60 border border-slate-600 text-slate-200'
            }`}
          >
            <span className="text-base shrink-0">
              {statusType === 'fail' ? '💥' : statusType === 'success' ? '🎉' : '🤖'}
            </span>
            <span className="leading-snug">{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Under-stage note on linked character */}
      <div className="mt-2 text-center text-xs text-slate-500">
        💡 <strong>[탭 1]</strong>에서 그린 나만의 픽셀 캐릭터가 맵 위에서 탐험 중이에요!
      </div>
    </div>
  );
};
