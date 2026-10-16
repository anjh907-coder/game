import React, { useState } from 'react';
import { X, Sparkles, ZoomIn, Layers, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConceptModal: React.FC<ConceptModalProps> = ({ isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<'normal' | 'zoomed'>('zoomed');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-indigo-600 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                픽셀아트(Pixel Art)란 뭘까?
              </h2>
              <p className="text-xs text-indigo-100">
                초등학교 3~4학년을 위한 재미있는 디지털 미술 이야기
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playUndo();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-indigo-200 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-700 text-sm">
          {/* Section 1: The Concept */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <h3 className="font-bold text-indigo-900 text-sm mb-1 flex items-center gap-1.5">
              <span>🟦</span>
              <span>1. 픽셀(Pixel)은 네모난 색종이 조각이에요!</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>픽셀(Pixel)</strong>은 <span className="text-indigo-600 font-semibold">Picture(그림)</span>와 <span className="text-indigo-600 font-semibold">Element(원소)</span>를 합친 말이에요. 
              컴퓨터 화면을 돋보기로 아주 크게 확대해보면 수많은 <strong>네모난 색 점</strong>들로 이루어져 있어요!
            </p>
          </div>

          {/* Section 2: Minecraft & Retro Game Analogy */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>🎮</span>
              <span>2. 마인크래프트와 고전 게임의 비밀!</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              옛날 오락실 게임(슈퍼 마리오, 팩맨, 포켓몬스터)이나 우리가 좋아하는 <strong>마인크래프트의 네모난 블록</strong>처럼, 
              하나하나 네모를 찍어서 캐릭터와 세상을 만드는 기법을 <strong>'픽셀아트'</strong>(또는 '도트 그래픽')라고 불러요.
            </p>
          </div>

          {/* Interactive Zoom Comparison Demo */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5 text-indigo-600" />
                <span>직접 비교해보기: 멀리서 볼 때 vs 돋보기로 볼 때</span>
              </span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setZoomLevel('zoomed')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    zoomLevel === 'zoomed' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  픽셀 돋보기 (확대)
                </button>
                <button
                  onClick={() => setZoomLevel('normal')}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    zoomLevel === 'normal' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  멀리서 본 모습
                </button>
              </div>
            </div>

            <div className="h-28 flex items-center justify-center bg-white rounded-lg border border-slate-200 overflow-hidden">
              {zoomLevel === 'zoomed' ? (
                <div className="grid grid-cols-7 gap-1 p-2 bg-slate-100 rounded border border-slate-300">
                  {/* Mini pixel smiley face */}
                  {['', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308', '',
                    '#eab308', '#000000', '#eab308', '#eab308', '#eab308', '#000000', '#eab308',
                    '#eab308', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308', '#eab308',
                    '#eab308', '#000000', '#eab308', '#eab308', '#eab308', '#000000', '#eab308',
                    '', '#000000', '#000000', '#000000', '#000000', '#000000', ''
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-xs border border-black/10"
                      style={{ backgroundColor: c || 'transparent' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <div className="text-4xl">😊</div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    점이 모이면 이렇게 자연스러운 그림으로 보여요!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Why Transparent background is essential for Scratch */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5">
            <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
              <span>✨</span>
              <span>3. 스크래치에서 쓸 때 꼭 알아둘 점! (투명 배경)</span>
            </h3>
            <ul className="text-xs sm:text-sm text-amber-950 space-y-1 list-disc list-inside">
              <li>
                <strong>바둑판 무늬</strong>는 색이 없는 <strong>'투명한 공간'</strong>을 뜻해요.
              </li>
              <li>
                캐릭터 주변 빈칸을 하얀색으로 칠해버리면, 스크래치 무대 배경 위에 하얀 네모 상자가 얹어져 어색해져요.
              </li>
              <li>
                캐릭터 겉부분은 지우개로 지워 투명하게 남겨두는 센스를 발휘해보세요!
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex justify-end">
          <button
            onClick={() => {
              sounds.playSuccess();
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            멋진 캐릭터 그리러 가기!
          </button>
        </div>
      </div>
    </div>
  );
};
