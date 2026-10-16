import React from 'react';
import { Pipette } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ColorPaletteProps {
  currentColor: string;
  onSelectColor: (hex: string) => void;
  recentColors: string[];
}

// 16 rich, elementary-friendly classic retro game colors
const PRESET_COLORS: { hex: string; name: string }[] = [
  { hex: '#000000', name: '검정' },
  { hex: '#475569', name: '어두운 회색' },
  { hex: '#cbd5e1', name: '밝은 회색' },
  { hex: '#ffffff', name: '하양' },
  { hex: '#ef4444', name: '빨강' },
  { hex: '#f97316', name: '주황' },
  { hex: '#eab308', name: '노랑' },
  { hex: '#84cc16', name: '연두' },
  { hex: '#22c55e', name: '초록' },
  { hex: '#06b6d4', name: '하늘' },
  { hex: '#3b82f6', name: '파랑' },
  { hex: '#6366f1', name: '남색' },
  { hex: '#a855f7', name: '보라' },
  { hex: '#ec4899', name: '분홍' },
  { hex: '#fed7aa', name: '살구(살색)' },
  { hex: '#78350f', name: '갈색' },
];

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  currentColor,
  onSelectColor,
  recentColors,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
      {/* Current Color Indicator & Custom Picker */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg border-2 border-slate-300 shadow-xs transition-transform"
            style={{ backgroundColor: currentColor }}
          />
          <div>
            <div className="text-xs font-bold text-slate-800">선택된 색상</div>
            <div className="text-[11px] font-mono text-slate-500 uppercase">{currentColor}</div>
          </div>
        </div>

        {/* Custom Color Input */}
        <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
          <Pipette className="w-3.5 h-3.5 text-indigo-600" />
          <span>내 색상 고르기</span>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => {
              sounds.playPicker();
              onSelectColor(e.target.value);
            }}
            className="w-0 h-0 opacity-0 absolute pointer-events-none"
          />
        </label>
      </div>

      {/* Preset 16 Colors Grid */}
      <div>
        <div className="text-xs font-bold text-slate-700 mb-2">기본 팔레트 (16색)</div>
        <div className="grid grid-cols-8 sm:grid-cols-8 gap-1.5 sm:gap-2">
          {PRESET_COLORS.map((c) => {
            const isSelected = currentColor.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.hex}
                onClick={() => {
                  sounds.playPicker();
                  onSelectColor(c.hex);
                }}
                className={`w-full aspect-square rounded-lg border transition-all cursor-pointer relative group flex items-center justify-center ${
                  isSelected
                    ? 'ring-3 ring-indigo-500 scale-105 z-10 border-white'
                    : 'border-slate-300 hover:scale-110 hover:border-slate-400'
                }`}
                style={{ backgroundColor: c.hex }}
                title={`${c.name} (${c.hex})`}
              >
                {isSelected && (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      c.hex === '#ffffff' || c.hex === '#cbd5e1' || c.hex === '#fed7aa'
                        ? 'bg-slate-900'
                        : 'bg-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Colors */}
      {recentColors.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-500 mb-1.5">최근 사용한 색</div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {recentColors.slice(0, 8).map((hex, idx) => (
              <button
                key={`${hex}-${idx}`}
                onClick={() => {
                  sounds.playPicker();
                  onSelectColor(hex);
                }}
                className="w-6 h-6 rounded-md border border-slate-300 shrink-0 cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: hex }}
                title={`최근 색상: ${hex}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
