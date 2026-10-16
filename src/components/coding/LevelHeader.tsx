import React, { useState } from 'react';
import { MissionLevel } from '../../types';
import { sounds } from '../../utils/audio';
import { ChevronLeft, ChevronRight, Lightbulb, CheckCircle2 } from 'lucide-react';

interface LevelHeaderProps {
  level: MissionLevel;
  currentLevelIndex: number;
  totalLevels: number;
  completedLevels: number[];
  onSelectLevel: (index: number) => void;
}

export const LevelHeader: React.FC<LevelHeaderProps> = ({
  level,
  currentLevelIndex,
  totalLevels,
  completedLevels,
  onSelectLevel,
}) => {
  const [showHint, setShowHint] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
      {/* 1. Top Bar: Level Selector & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & Concept */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-indigo-600 text-white font-pixel text-[11px] px-2 py-0.5 rounded-md">
              LV.{level.id}
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              {level.title}
            </h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-200">
              {level.concept}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {level.story}
          </p>
        </div>

        {/* Level Prev / Next & Hint Button */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <button
            onClick={() => {
              sounds.playUndo();
              setShowHint(!showHint);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border ${
              showHint
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>{showHint ? '힌트 닫기' : '힌트 보기'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playUndo();
              if (currentLevelIndex > 0) onSelectLevel(currentLevelIndex - 1);
            }}
            disabled={currentLevelIndex === 0}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="이전 단계"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playUndo();
              if (currentLevelIndex < totalLevels - 1) onSelectLevel(currentLevelIndex + 1);
            }}
            disabled={currentLevelIndex === totalLevels - 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="다음 단계"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hint Alert Box */}
      {showHint && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2 animate-fadeIn">
          <span className="text-base shrink-0">💡</span>
          <div>
            <strong className="block font-bold mb-0.5">선생님의 힌트</strong>
            <p>{level.hint}</p>
          </div>
        </div>
      )}

      {/* 2. 10-Level Progress Dots / Tabs */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-1 overflow-x-auto pb-1">
        {Array.from({ length: totalLevels }, (_, idx) => {
          const lvlNum = idx + 1;
          const isCurrent = idx === currentLevelIndex;
          const isCompleted = completedLevels.includes(lvlNum);

          return (
            <button
              key={lvlNum}
              onClick={() => {
                sounds.playUndo();
                onSelectLevel(idx);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                isCurrent
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isCompleted
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{lvlNum}</span>
              {isCompleted && !isCurrent && (
                <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
