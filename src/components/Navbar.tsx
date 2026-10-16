import React from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle, BookOpen, Palette, Rocket } from 'lucide-react';
import { sounds } from '../utils/audio';

export type MainTab = 'pixel' | 'coding';

interface NavbarProps {
  activeTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onOpenConcept: () => void;
  onOpenScratchGuide: () => void;
  onOpenTemplates: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenConcept,
  onOpenScratchGuide,
  onOpenTemplates,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <span className="font-pixel text-xs tracking-tighter">PX</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight whitespace-nowrap">
              픽셀 & 코딩 스튜디오
            </h1>
            <p className="hidden md:block text-[11px] text-slate-500 font-medium">
              초등 SW 교육 · 캐릭터와 함께하는 코딩 모험
            </p>
          </div>
        </div>

        {/* Zone 2: Main 2-Tab Navigation Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0">
          <button
            onClick={() => {
              sounds.playUndo();
              onSelectTab('pixel');
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pixel'
                ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4 text-indigo-600" />
            <span className="hidden xs:inline">탭 1:</span>
            <span>🎨 픽셀아트 그리기</span>
          </button>

          <button
            onClick={() => {
              sounds.playUndo();
              onSelectTab('coding');
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'coding'
                ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Rocket className="w-4 h-4 text-emerald-600" />
            <span className="hidden xs:inline">탭 2:</span>
            <span>🚀 블록 코딩 모험</span>
          </button>
        </div>

        {/* Zone 3: Educational Modals & Audio Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {activeTab === 'pixel' && (
            <>
              <button
                onClick={() => {
                  sounds.playUndo();
                  onOpenConcept();
                }}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors whitespace-nowrap cursor-pointer"
                title="픽셀아트 원리 알아보기"
              >
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>원리 설명</span>
              </button>

              <button
                onClick={() => {
                  sounds.playUndo();
                  onOpenTemplates();
                }}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors whitespace-nowrap cursor-pointer"
                title="예시 템플릿 불러오기"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>예시</span>
              </button>

              <button
                onClick={() => {
                  sounds.playUndo();
                  onOpenScratchGuide();
                }}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors whitespace-nowrap cursor-pointer"
                title="스크래치에 캐릭터 넣는 방법"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>스크래치 사용법</span>
              </button>
            </>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              soundEnabled
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
            }`}
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
            aria-label="효과음 설정"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
