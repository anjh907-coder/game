import React, { useState, useRef, useEffect } from 'react';
import { Download, Play, Square, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { BackgroundStyle, GridSize } from '../types';
import { sounds } from '../utils/audio';

interface ScratchExportPanelProps {
  grid: string[][];
  gridSize: GridSize;
  onOpenScratchGuide: () => void;
}

export const ScratchExportPanel: React.FC<ScratchExportPanelProps> = ({
  grid,
  gridSize,
  onOpenScratchGuide,
}) => {
  const [fileName, setFileName] = useState('my_pixel_character');
  const [exportScale, setExportScale] = useState<number>(256); // 16, 256, 512
  const [stageBg, setStageBg] = useState<BackgroundStyle>('sky');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render current sprite into preview canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 128;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    // Disable image smoothing for razor-sharp pixel art
    ctx.imageSmoothingEnabled = false;

    // Draw directly at scale
    const pixelSize = size / gridSize;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const color = grid[r]?.[c];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  }, [grid, gridSize]);

  // Export as transparent crisp PNG
  const handleDownload = () => {
    sounds.playSuccess();

    // Create offscreen canvas for crystal-clear nearest-neighbor scaling
    const offscreen = document.createElement('canvas');
    const targetSize = exportScale;
    offscreen.width = targetSize;
    offscreen.height = targetSize;
    const ctx = offscreen.getContext('2d');

    if (!ctx) return;

    // Critical for pixel art: disable smoothing
    ctx.imageSmoothingEnabled = false;

    // Clear with transparent alpha
    ctx.clearRect(0, 0, targetSize, targetSize);

    const pixelSize = targetSize / gridSize;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const color = grid[r]?.[c];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    // Trigger download
    const dataUrl = offscreen.toDataURL('image/png');
    const link = document.createElement('a');
    const cleanName = fileName.trim() || 'my_pixel_character';
    link.download = `${cleanName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 2500);
  };

  // Background style helper for live stage
  const getStageBgClass = () => {
    switch (stageBg) {
      case 'sky':
        return 'bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-400';
      case 'space':
        return 'bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950';
      case 'grid':
        return 'bg-white bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] border border-slate-300';
      case 'dark':
        return 'bg-slate-900';
      case 'transparent':
      default:
        return 'checkerboard-pattern';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>스크래치(Scratch) 스프라이트 생성</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            배경이 투명한 고화질 PNG로 저장되어 스크래치에 바로 넣을 수 있어요!
          </p>
        </div>
      </div>

      {/* 1. Scratch Live Stage Preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-slate-700">스크래치 무대 미리보기</div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-1 px-2 rounded-md text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                isPlaying ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? '움직임 멈춤' : '움직여보기'}</span>
            </button>
          </div>
        </div>

        {/* Mock Scratch Stage Box */}
        <div
          className={`w-full h-40 rounded-xl overflow-hidden relative flex items-center justify-center transition-all ${getStageBgClass()}`}
        >
          {/* Scratch Top-left Flag & Stop Icons Decoration */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="초록 깃발" />
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" title="정지 버튼" />
            <span className="text-[10px] text-white/90 font-mono font-bold ml-1">Scratch Stage</span>
          </div>

          {/* Sprite Canvas with Optional Bouncing Animation */}
          <div
            className={`transition-transform duration-300 relative ${
              isPlaying ? 'animate-bounce' : ''
            }`}
            style={{ animationDuration: '1.2s' }}
          >
            <canvas
              ref={previewCanvasRef}
              className="pixelated w-24 h-24 drop-shadow-md"
            />
          </div>

          {/* Bottom backdrop switcher */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/80 backdrop-blur-xs p-1 rounded-lg z-10 text-[10px] font-semibold text-slate-700">
            <span className="hidden sm:inline px-1">배경:</span>
            <button
              onClick={() => setStageBg('sky')}
              className={`px-1.5 py-0.5 rounded ${stageBg === 'sky' ? 'bg-sky-500 text-white' : 'hover:bg-slate-200'}`}
            >
              하늘
            </button>
            <button
              onClick={() => setStageBg('space')}
              className={`px-1.5 py-0.5 rounded ${stageBg === 'space' ? 'bg-indigo-900 text-white' : 'hover:bg-slate-200'}`}
            >
              우주
            </button>
            <button
              onClick={() => setStageBg('grid')}
              className={`px-1.5 py-0.5 rounded ${stageBg === 'grid' ? 'bg-slate-700 text-white' : 'hover:bg-slate-200'}`}
            >
              모눈
            </button>
            <button
              onClick={() => setStageBg('transparent')}
              className={`px-1.5 py-0.5 rounded ${stageBg === 'transparent' ? 'bg-slate-500 text-white' : 'hover:bg-slate-200'}`}
            >
              투명
            </button>
          </div>
        </div>
      </div>

      {/* 2. Export Configuration */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        {/* Filename */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            저장할 파일 이름
          </label>
          <div className="flex items-center">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="my_pixel_character"
              className="w-full text-xs font-medium px-3 py-2 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <span className="bg-slate-100 border border-l-0 border-slate-300 px-3 py-2 text-xs font-mono text-slate-500 rounded-r-lg">
              .png
            </span>
          </div>
        </div>

        {/* Upscale Size Selector */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700">저장 크기 (화질)</label>
            <span className="text-[11px] text-amber-600 font-bold">256x256 스크래치 강력 추천!</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { size: 16, label: '16x16', desc: '원본' },
              { size: 256, label: '256x256', desc: '스크래치 표준' },
              { size: 512, label: '512x512', desc: '고화질 HD' },
            ].map((item) => (
              <button
                key={item.size}
                onClick={() => setExportScale(item.size)}
                className={`py-2 px-2 text-center rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  exportScale === item.size
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div>{item.label}</div>
                <div className="text-[10px] font-normal text-slate-500">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Download Button */}
        <button
          onClick={handleDownload}
          className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
            downloadSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md active:scale-[0.99]'
          }`}
        >
          {downloadSuccess ? (
            <>
              <Check className="w-5 h-5 animate-pulse" />
              <span>다운로드 완료! (.png 저장됨)</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>스크래치용 투명 PNG 다운로드</span>
            </>
          )}
        </button>

        {/* Scratch Quick Link & Guide Tip */}
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-medium">
            <span className="text-base">💡</span>
            <span>다운로드 후 스크래치에서 불러오는 법이 궁금한가요?</span>
          </div>
          <button
            onClick={onOpenScratchGuide}
            className="font-bold text-emerald-700 hover:text-emerald-900 underline whitespace-nowrap cursor-pointer"
          >
            안내 보기
          </button>
        </div>
      </div>
    </div>
  );
};
