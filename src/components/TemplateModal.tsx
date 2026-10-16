import React, { useRef, useEffect } from 'react';
import { X, Sparkles, Wand2 } from 'lucide-react';
import { CharacterTemplate } from '../types';
import { TEMPLATES } from '../utils/templates';
import { sounds } from '../utils/audio';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CharacterTemplate) => void;
}

// Mini preview canvas for each template card
const TemplateThumbnail: React.FC<{ grid: string[][]; size: number }> = ({ grid, size }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 64;
    canvas.width = w;
    canvas.height = w;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, w);

    const cellSize = w / size;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const color = grid[r]?.[c];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }, [grid, size]);

  return (
    <div className="w-16 h-16 rounded-lg checkerboard-pattern border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
      <canvas ref={canvasRef} className="pixelated w-16 h-16" />
    </div>
  );
};

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-amber-500 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                예시 템플릿 불러오기
              </h2>
              <p className="text-xs text-amber-100">
                마음에 드는 캐릭터를 골라 색을 바꾸거나 자유롭게 꾸며보세요!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playUndo();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-amber-100 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template List */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => {
                sounds.playBucket();
                onSelectTemplate(tmpl);
              }}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all cursor-pointer group"
            >
              <TemplateThumbnail grid={tmpl.grid} size={tmpl.size} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-amber-800">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                    {tmpl.size}x{tmpl.size}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {tmpl.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>💡 템플릿을 누르면 현재 캔버스가 선택한 캐릭터로 바뀝니다.</span>
          <button
            onClick={() => {
              sounds.playUndo();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
