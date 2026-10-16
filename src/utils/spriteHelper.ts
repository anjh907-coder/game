// Utility to render grid pixel art into an image data URL with nearest-neighbor crispness
export const gridToDataUrl = (grid: string[][], size: number = 64): string => {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const gridSize = grid.length;
  if (gridSize === 0) return '';
  const pixelSize = size / gridSize;

  let hasDrawnPixel = false;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const color = grid[r]?.[c];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(c * pixelSize, r * pixelSize, pixelSize, pixelSize);
        hasDrawnPixel = true;
      }
    }
  }

  // If grid is completely blank, draw a cute default robot/slime
  if (!hasDrawnPixel) {
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(size * 0.38, size * 0.42, size * 0.08, 0, Math.PI * 2);
    ctx.arc(size * 0.62, size * 0.42, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL('image/png');
};
