import React from 'react';
import { 
  Pencil, 
  Eraser, 
  PaintBucket, 
  Pipette, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Grid3X3, 
  Columns2 
} from 'lucide-react';
import { ToolType, GridSize } from '../types';
import { sounds } from '../utils/audio';

interface ToolbarProps {
  tool: ToolType;
  onSelectTool: (t: ToolType) => void;
  gridSize: GridSize;
  onChangeGridSize: (size: GridSize) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  symmetry: boolean;
  onToggleSymmetry: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  onSelectTool,
  gridSize,
  onChangeGridSize,
  showGrid,
  onToggleGrid,
  symmetry,
  onToggleSymmetry,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
}) => {
  const tools: { id: ToolType; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'pencil', label: '연필', icon: <Pencil className="w-5 h-5" />, shortcut: '1' },
    { id: 'eraser', label: '지우개', icon: <Eraser className="w-5 h-5" />, shortcut: '2' },
    { id: 'bucket', label: '페인트통', icon: <PaintBucket className="w-5 h-5" />, shortcut: '3' },
    { id: 'picker', label: '스포이드', icon: <Pipette className="w-5 h-5" />, shortcut: '4' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-4">
      {/* 1. Grid Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-700">캔버스 크기</span>
          <span className="text-[11px] text-slate-400 font-medium">초등 3~4학년 16x16 추천</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
          {([8, 16, 24] as GridSize[]).map((size) => (
            <button
              key={size}
              onClick={() => {
                if (size !== gridSize) {
                  sounds.playUndo();
                  onChangeGridSize(size);
                }
              }}
              className={`py-1.5 px-2 text-xs font-bold rounded-md transition-all cursor-pointer text-center ${
                gridSize === size
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {size}x{size}
              {size === 16 && <span className="block text-[10px] font-normal text-indigo-500">추천</span>}
              {size === 8 && <span className="block text-[10px] font-normal text-slate-400">초급</span>}
              {size === 24 && <span className="block text-[10px] font-normal text-slate-400">심화</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Drawing Tools */}
      <div>
        <div className="text-xs font-bold text-slate-700 mb-1.5">그리기 도구</div>
        <div className="grid grid-cols-2 gap-2">
          {tools.map((t) => {
            const isActive = tool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  sounds.playUndo();
                  onSelectTool(t.id);
                }}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`p-1 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {t.icon}
                </div>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Helper Modes: Symmetry & Grid Toggle */}
      <div>
        <div className="text-xs font-bold text-slate-700 mb-1.5">도우미 기능</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              sounds.playUndo();
              onToggleSymmetry();
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              symmetry
                ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-200'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="캐릭터 얼굴/몸을 그릴 때 반대쪽도 같이 그려집니다"
          >
            <Columns2 className="w-4 h-4 text-purple-600" />
            <span>좌우 대칭 {symmetry ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playUndo();
              onToggleGrid();
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              showGrid
                ? 'bg-slate-100 border-slate-400 text-slate-900'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title="모눈종이 격자선을 켜거나 끕니다"
          >
            <Grid3X3 className="w-4 h-4 text-slate-600" />
            <span>격자선 {showGrid ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* 4. History & Clear Action */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sounds.playUndo();
              onUndo();
            }}
            disabled={!canUndo}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
              canUndo
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
            }`}
            title="되돌리기 (Ctrl + Z)"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">되돌리기</span>
          </button>

          <button
            onClick={() => {
              sounds.playUndo();
              onRedo();
            }}
            disabled={!canRedo}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
              canRedo
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
            }`}
            title="다시 실행 (Ctrl + Y)"
          >
            <RotateCw className="w-4 h-4" />
            <span className="hidden sm:inline">다시실행</span>
          </button>
        </div>

        <button
          onClick={onClear}
          className="p-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          title="캔버스 비우기"
        >
          <Trash2 className="w-4 h-4" />
          <span>전체 지우기</span>
        </button>
      </div>
    </div>
  );
};
