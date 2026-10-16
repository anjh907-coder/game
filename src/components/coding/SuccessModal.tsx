import React from 'react';
import { Sparkles, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface SuccessModalProps {
  isOpen: boolean;
  levelNumber: number;
  isLastLevel: boolean;
  blockCount: number;
  maxBlocks?: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onGoToPixelArt: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  levelNumber,
  isLastLevel,
  blockCount,
  maxBlocks,
  onNextLevel,
  onReplay,
  onGoToPixelArt,
}) => {
  if (!isOpen) return null;

  // Star calculation
  const stars = maxBlocks ? (blockCount <= maxBlocks ? 3 : 2) : 3;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-6 text-center space-y-4 animate-scaleUp">
        {/* Celebration Trophy */}
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center mx-auto shadow-inner text-3xl">
          🏆
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {isLastLevel ? '🎉 최종 8단계 보석 트랙 완주 성공! 🎉' : `Level ${levelNumber} 미션 성공!`}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isLastLevel
              ? '축하합니다! 5x5 사각 트랙을 자율주행으로 완벽히 완주하고 모든 보석을 모았어요. 이제 스크래치에서도 멋진 게임을 만들 준비가 되었습니다!'
              : '보물 상자에 안전하게 도착했습니다. 훌륭한 알고리즘이에요!'}
          </p>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`text-2xl transition-transform ${
                i < stars ? 'text-amber-400 scale-110' : 'text-slate-200'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600 flex justify-around">
          <div>
            <div className="text-[10px] text-slate-400">사용한 블록</div>
            <div className="font-bold text-slate-800 text-sm">{blockCount}개</div>
          </div>
          {maxBlocks && (
            <div>
              <div className="text-[10px] text-slate-400">목표 블록 수</div>
              <div className="font-bold text-indigo-600 text-sm">{maxBlocks}개 이하</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {!isLastLevel ? (
            <button
              onClick={() => {
                sounds.playSuccess();
                onNextLevel();
              }}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span>다음 단계로 가기 (Level {levelNumber + 1})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playSuccess();
                onGoToPixelArt();
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>내 캐릭터 스크래치로 다운로드하러 가기!</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playUndo();
              onReplay();
            }}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>이 단계 다시 해보기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
