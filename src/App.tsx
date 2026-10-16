import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, MainTab } from './components/Navbar';
import { Toolbar } from './components/Toolbar';
import { ColorPalette } from './components/ColorPalette';
import { PixelCanvas } from './components/PixelCanvas';
import { ScratchExportPanel } from './components/ScratchExportPanel';
import { ConceptModal } from './components/ConceptModal';
import { ScratchGuideModal } from './components/ScratchGuideModal';
import { ClearConfirmModal } from './components/ClearConfirmModal';
import { TemplateModal } from './components/TemplateModal';
import { CodingAdventure } from './components/coding/CodingAdventure';
import { GridSize, ToolType, CharacterTemplate } from './types';
import { createEmptyGrid, TEMPLATES } from './utils/templates';
import { sounds } from './utils/audio';
import { Rocket, HelpCircle, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>('pixel');

  // Pixel Art State
  const [gridSize, setGridSize] = useState<GridSize>(16);
  // Default: 16x16 with slime template loaded as a friendly starting point
  const [grid, setGrid] = useState<string[][]>(() => {
    const defaultTemplate = TEMPLATES.find(t => t.id === 'slime');
    return defaultTemplate ? defaultTemplate.grid.map(row => [...row]) : createEmptyGrid(16);
  });

  // History stack for Undo / Redo
  const [history, setHistory] = useState<string[][][]>(() => [
    grid.map(row => [...row])
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Tools & Colors
  const [tool, setTool] = useState<ToolType>('pencil');
  const [currentColor, setCurrentColor] = useState<string>('#22c55e');
  const [recentColors, setRecentColors] = useState<string[]>([
    '#22c55e', '#15803d', '#86efac', '#0f172a', '#ffffff', '#f43f5e'
  ]);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [symmetry, setSymmetry] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals
  const [isConceptOpen, setIsConceptOpen] = useState<boolean>(false);
  const [isScratchGuideOpen, setIsScratchGuideOpen] = useState<boolean>(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState<boolean>(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState<boolean>(false);

  // Sync sound settings
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Push new state to history
  const pushHistory = useCallback((newGrid: string[][]) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      const updated = [...sliced, newGrid.map(row => [...row])];
      if (updated.length > 25) {
        return updated.slice(updated.length - 25);
      }
      return updated;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 24));
  }, [historyIndex]);

  // Brush stroke handlers
  const preStrokeGrid = React.useRef<string[][] | null>(null);

  const handleStartStroke = () => {
    preStrokeGrid.current = grid.map(row => [...row]);
  };

  const handleEndStroke = () => {
    if (preStrokeGrid.current) {
      const changed = JSON.stringify(preStrokeGrid.current) !== JSON.stringify(grid);
      if (changed) {
        pushHistory(grid);
      }
      preStrokeGrid.current = null;
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const targetGrid = history[nextIndex].map(row => [...row]);
      setHistoryIndex(nextIndex);
      setGrid(targetGrid);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetGrid = history[nextIndex].map(row => [...row]);
      setHistoryIndex(nextIndex);
      setGrid(targetGrid);
    }
  };

  // Change Grid Size
  const handleChangeGridSize = (newSize: GridSize) => {
    setGridSize(newSize);
    const newEmpty = createEmptyGrid(newSize);
    setGrid(newEmpty);
    setHistory([newEmpty.map(row => [...row])]);
    setHistoryIndex(0);
  };

  // Clear Canvas
  const handleConfirmClear = () => {
    const cleared = createEmptyGrid(gridSize);
    setGrid(cleared);
    pushHistory(cleared);
    setIsClearConfirmOpen(false);
  };

  // Load Template
  const handleSelectTemplate = (template: CharacterTemplate) => {
    setGridSize(template.size);
    const cloned = template.grid.map(row => [...row]);
    setGrid(cloned);
    setHistory([cloned.map(row => [...row])]);
    setHistoryIndex(0);
    setIsTemplateOpen(false);
  };

  // Color handlers
  const addRecentColor = (colorHex: string) => {
    setRecentColors(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== colorHex.toLowerCase());
      return [colorHex, ...filtered].slice(0, 10);
    });
  };

  const handlePickColor = (colorHex: string) => {
    setCurrentColor(colorHex);
    setTool('pencil');
    addRecentColor(colorHex);
  };

  const handleSelectColor = (colorHex: string) => {
    setCurrentColor(colorHex);
    addRecentColor(colorHex);
  };

  // Keyboard shortcuts (only active on pixel art tab)
  useEffect(() => {
    if (mainTab !== 'pixel') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === '1') {
        setTool('pencil');
      } else if (e.key === '2') {
        setTool('eraser');
      } else if (e.key === '3') {
        setTool('bucket');
      } else if (e.key === '4') {
        setTool('picker');
      } else if (e.key === 'g' || e.key === 'G') {
        setShowGrid(prev => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        setSymmetry(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mainTab, historyIndex, history]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* 1. Header with Tab Switcher */}
      <Navbar
        activeTab={mainTab}
        onSelectTab={setMainTab}
        onOpenConcept={() => setIsConceptOpen(true)}
        onOpenScratchGuide={() => setIsScratchGuideOpen(true)}
        onOpenTemplates={() => setIsTemplateOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
      />

      {/* 2. Main Content Area */}
      {mainTab === 'pixel' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col lg:flex-row gap-5 items-start">
          {/* Left Column: Tools & Palette */}
          <section className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 shrink-0">
            <Toolbar
              tool={tool}
              onSelectTool={setTool}
              gridSize={gridSize}
              onChangeGridSize={handleChangeGridSize}
              showGrid={showGrid}
              onToggleGrid={() => setShowGrid(prev => !prev)}
              symmetry={symmetry}
              onToggleSymmetry={() => setSymmetry(prev => !prev)}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClear={() => setIsClearConfirmOpen(true)}
            />

            <ColorPalette
              currentColor={currentColor}
              onSelectColor={handleSelectColor}
              recentColors={recentColors}
            />
          </section>

          {/* Center Column: Interactive Pixel Canvas */}
          <section className="w-full flex-1 flex flex-col items-center justify-center min-w-0">
            <PixelCanvas
              grid={grid}
              gridSize={gridSize}
              tool={tool}
              currentColor={currentColor}
              showGrid={showGrid}
              symmetry={symmetry}
              onUpdateGrid={setGrid}
              onPickColor={handlePickColor}
              onStartStroke={handleStartStroke}
              onEndStroke={handleEndStroke}
            />

            {/* Quick tips bar */}
            <div className="mt-4 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-xs text-xs text-slate-600 flex items-center flex-wrap gap-x-4 gap-y-1 text-center justify-center max-w-lg">
              <span>🖱️ 마우스 클릭/드래그 또는 손가락으로 터치</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>⌨️ 단축키 1:연필 2:지우개 3:페인트 4:스포이드</span>
            </div>

            {/* Bridge Callout: Take character on block coding adventure */}
            <div className="mt-4 w-full max-w-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                  🚀
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold">
                    내가 그린 캐릭터로 블록 코딩 미션 출발!
                  </div>
                  <div className="text-[11px] text-emerald-100">
                    지금 그린 캐릭터가 8단계 미로 맵의 주인공이 됩니다.
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.playSuccess();
                  setMainTab('coding');
                }}
                className="px-3.5 py-2 rounded-xl bg-white text-emerald-800 text-xs font-extrabold hover:bg-emerald-50 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
              >
                도전하기
              </button>
            </div>
          </section>

          {/* Right Column: Scratch Export & Live Stage Simulator */}
          <section className="w-full lg:w-80 xl:w-96 flex flex-col gap-4 shrink-0">
            <ScratchExportPanel
              grid={grid}
              gridSize={gridSize}
              onOpenScratchGuide={() => setIsScratchGuideOpen(true)}
            />
          </section>
        </main>
      ) : (
        /* Tab 2: Code.org Style Block Coding Adventure */
        <CodingAdventure
          pixelGrid={grid}
          onGoToPixelArt={() => setMainTab('pixel')}
        />
      )}

      {/* 3. Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          픽셀 & 코딩 스튜디오 · 초등학교 3~4학년 SW 및 인공지능 기초 교육 플랫폼
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>🎨 픽셀아트</span>
          <span>·</span>
          <span>🚀 Code.org 미션</span>
          <span>·</span>
          <span>🐱 스크래치 연계</span>
        </div>
      </footer>

      {/* Modals */}
      <ConceptModal
        isOpen={isConceptOpen}
        onClose={() => setIsConceptOpen(false)}
      />

      <ScratchGuideModal
        isOpen={isScratchGuideOpen}
        onClose={() => setIsScratchGuideOpen(false)}
      />

      <TemplateModal
        isOpen={isTemplateOpen}
        onClose={() => setIsTemplateOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <ClearConfirmModal
        isOpen={isClearConfirmOpen}
        onConfirm={handleConfirmClear}
        onCancel={() => setIsClearConfirmOpen(false)}
      />
    </div>
  );
}
