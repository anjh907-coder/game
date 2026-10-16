import React from 'react';
import { BlockType } from '../../types';
import { sounds } from '../../utils/audio';
import { Plus, ArrowRight, RotateCw, RotateCcw, Repeat, HelpCircle } from 'lucide-react';

interface BlockPaletteProps {
  allowedBlocks: BlockType[];
  onAddBlock: (type: BlockType) => void;
  targetContainerId: string | null; // if currently focused on a repeat or if block
}

interface BlockDefinition {
  type: BlockType;
  label: string;
  category: 'motion' | 'control';
  colorClass: string;
  badge: string;
  icon: React.ReactNode;
  desc: string;
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({
  allowedBlocks,
  onAddBlock,
  targetContainerId,
}) => {
  const definitions: BlockDefinition[] = [
    {
      type: 'move',
      label: '앞으로 한 칸 걷기',
      category: 'motion',
      colorClass: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700',
      badge: '동작',
      icon: <ArrowRight className="w-4 h-4" />,
      desc: '바라보는 방향으로 1칸 전진',
    },
    {
      type: 'turn_right',
      label: '오른쪽으로 돌기 ↻',
      category: 'motion',
      colorClass: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700',
      badge: '동작',
      icon: <RotateCw className="w-4 h-4" />,
      desc: '시계 방향으로 90도 회전',
    },
    {
      type: 'turn_left',
      label: '왼쪽으로 돌기 ↺',
      category: 'motion',
      colorClass: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700',
      badge: '동작',
      icon: <RotateCcw className="w-4 h-4" />,
      desc: '반시계 방향으로 90도 회전',
    },
    {
      type: 'repeat',
      label: '번 반복하기',
      category: 'control',
      colorClass: 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600',
      badge: '제어',
      icon: <Repeat className="w-4 h-4" />,
      desc: '안에 넣은 블록을 정해진 횟수만큼 반복',
    },
    {
      type: 'if_path',
      label: '만약 앞에 길이 있으면',
      category: 'control',
      colorClass: 'bg-yellow-500 hover:bg-yellow-600 text-slate-900 border-yellow-600',
      badge: '조건',
      icon: <HelpCircle className="w-4 h-4" />,
      desc: '앞이 길일 때만 안쪽 블록 실행',
    },
    {
      type: 'collect_item',
      label: '아이템 줍기 💎',
      category: 'motion',
      colorClass: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700',
      badge: '동작',
      icon: <span className="text-sm">💎</span>,
      desc: '발밑에 있는 보석을 가방에 쏙 넣기',
    },
    {
      type: 'if_item',
      label: '만약 여기에 아이템이 있으면',
      category: 'control',
      colorClass: 'bg-yellow-500 hover:bg-yellow-600 text-slate-900 border-yellow-600',
      badge: '조건',
      icon: <HelpCircle className="w-4 h-4" />,
      desc: '현재 위치에 보석이 있을 때만 안쪽 블록 실행',
    },
    {
      type: 'if_obstacle',
      label: '만약 앞에 장애물이 있으면',
      category: 'control',
      colorClass: 'bg-yellow-500 hover:bg-yellow-600 text-slate-900 border-yellow-600',
      badge: '조건',
      icon: <HelpCircle className="w-4 h-4" />,
      desc: '앞이 바위나 벽일 때만 안쪽 블록 실행',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3 flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-slate-100 pb-2">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between">
          <span>📦 블록 보관함</span>
          <span className="text-[11px] font-normal text-slate-500">클릭하여 추가</span>
        </h3>
        {targetContainerId && (
          <div className="mt-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
            반복문 안에 블록이 추가됩니다.
          </div>
        )}
      </div>

      {/* Block List */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-0.5">
        {definitions
          .filter((def) => allowedBlocks.includes(def.type))
          .map((b) => (
            <button
              key={b.type}
              onClick={() => {
                sounds.playSnap();
                onAddBlock(b.type);
              }}
              className={`w-full text-left p-2.5 rounded-lg border shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-between group ${b.colorClass}`}
            >
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-black/10 group-hover:bg-black/20 transition-colors">
                  {b.icon}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    {b.type === 'repeat' && <span className="underline decoration-white/60">5</span>}
                    <span>{b.label}</span>
                  </div>
                  <div className="text-[10px] opacity-85">{b.desc}</div>
                </div>
              </div>
              <Plus className="w-4 h-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all shrink-0" />
            </button>
          ))}
      </div>

      {/* Toolbox Helper Note */}
      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
        💡 스크래치(Scratch)와 똑같은 모양과 색깔의 코딩 블록입니다.
      </div>
    </div>
  );
};
