import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GridSize, ToolType } from '../types';
import { sounds } from '../utils/audio';

interface PixelCanvasProps {
  grid: string[][];
  gridSize: GridSize;
  tool: ToolType;
  currentColor: string;
  showGrid: boolean;
  symmetry: boolean;
  onUpdateGrid: (newGrid: string[][]) => void;
  onPickColor: (color: string) => void;
  onStartStroke: () => void;
  onEndStroke: () => void;
}

export const PixelCanvas: React.FC<PixelCanvasProps> = ({
  grid,
  gridSize,
  tool,
  currentColor,
  showGrid,
  symmetry,
  onUpdateGrid,
  onPickColor,
  onStartStroke,
  onEndStroke,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const lastDrawnCell = useRef<{ x: number; y: number } | null>(null);

  // Canvas visual sizing
  const DISPLAY_SIZE = 480; // base visual pixels

  // Helper: flood fill algorithm
  const floodFill = useCallback((startX: number, startY: number, targetColor: string, fillColor: string) => {
    if (targetColor === fillColor) return;
    
    // Copy grid
    const newGrid = grid.map(row => [...row]);
    const queue: [number, number][] = [[startX, startY]];
    const visited = new Set<string>();
    visited.add(`${startX},${startY}`);

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      newGrid[y][x] = fillColor;

      const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0]
      ];

      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
          const key = `${nx},${ny}`;
          if (!visited.has(key) && newGrid[ny][nx] === targetColor) {
            visited.add(key);
            queue.push([nx, ny]);
          }
        }
      }
    }

    sounds.playBucket();
    onUpdateGrid(newGrid);
  }, [grid, gridSize, onUpdateGrid]);

  // Apply tool action to a specific cell
  const applyTool = useCallback((x: number, y: number, currentGridState: string[][]): string[][] => {
    const updated = currentGridState.map(row => [...row]);
    const paintCell = (cx: number, cy: number, colorVal: string) => {
      if (cx >= 0 && cx < gridSize && cy >= 0 && cy < gridSize) {
        updated[cy][cx] = colorVal;
      }
    };

    if (tool === 'pencil') {
      paintCell(x, y, currentColor);
      if (symmetry) {
        paintCell(gridSize - 1 - x, y, currentColor);
      }
      sounds.playPencil();
    } else if (tool === 'eraser') {
      paintCell(x, y, '');
      if (symmetry) {
        paintCell(gridSize - 1 - x, y, '');
      }
      sounds.playEraser();
    } else if (tool === 'picker') {
      const picked = currentGridState[y]?.[x];
      if (picked) {
        sounds.playPicker();
        onPickColor(picked);
      }
      return updated;
    }

    return updated;
  }, [tool, currentColor, symmetry, gridSize, onPickColor]);

  // Convert pointer event to grid coords
  const getCellCoords = (e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const scaleX = gridSize / rect.width;
    const scaleY = gridSize / rect.height;

    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);

    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return null;
    return { x, y };
  };

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);

    const cell = getCellCoords(e);
    if (!cell) return;

    if (tool === 'bucket') {
      onStartStroke();
      const targetColor = grid[cell.y][cell.x] || '';
      floodFill(cell.x, cell.y, targetColor, currentColor);
      onEndStroke();
      return;
    }

    if (tool === 'picker') {
      const picked = grid[cell.y]?.[cell.x];
      if (picked) {
        sounds.playPicker();
        onPickColor(picked);
      }
      return;
    }

    setIsDrawing(true);
    onStartStroke();

    const newGrid = applyTool(cell.x, cell.y, grid);
    lastDrawnCell.current = cell;
    onUpdateGrid(newGrid);
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cell = getCellCoords(e);
    setHoverPos(cell);

    if (!isDrawing || !cell) return;
    if (tool === 'bucket' || tool === 'picker') return;

    // Avoid redundant draw on same cell
    if (lastDrawnCell.current && lastDrawnCell.current.x === cell.x && lastDrawnCell.current.y === cell.y) {
      return;
    }

    lastDrawnCell.current = cell;
    const newGrid = applyTool(cell.x, cell.y, grid);
    onUpdateGrid(newGrid);
  };

  // Pointer Up / Cancel
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDrawing) {
      setIsDrawing(false);
      lastDrawnCell.current = null;
      onEndStroke();
    }
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerLeave = () => {
    setHoverPos(null);
  };

  // Main Canvas Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = DISPLAY_SIZE;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, size, size);

    const cellSize = size / gridSize;

    // 1. Draw painted pixels
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const color = grid[r]?.[c];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }

    // 2. Draw Grid Lines (if enabled)
    if (showGrid) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)'; // soft slate border
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let i = 0; i <= gridSize; i++) {
        const pos = Math.round(i * cellSize) + 0.5;
        // Vertical
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, size);
        // Horizontal
        ctx.moveTo(0, pos);
        ctx.lineTo(size, pos);
      }
      ctx.stroke();
    }

    // 3. Symmetry center guide line (if symmetry is ON)
    if (symmetry) {
      const midPos = (gridSize / 2) * cellSize;
      ctx.strokeStyle = '#a855f7'; // purple symmetry line
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(midPos, 0);
      ctx.lineTo(midPos, size);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 4. Hover cursor box
    if (hoverPos) {
      const { x, y } = hoverPos;
      const hx = x * cellSize;
      const hy = y * cellSize;

      ctx.lineWidth = 2;
      ctx.strokeStyle = tool === 'eraser' ? '#ef4444' : '#6366f1';
      ctx.strokeRect(hx + 1, hy + 1, cellSize - 2, cellSize - 2);

      // Symmetry counterpart hover box
      if (symmetry && (tool === 'pencil' || tool === 'eraser')) {
        const symX = gridSize - 1 - x;
        const shx = symX * cellSize;
        ctx.strokeStyle = '#a855f7';
        ctx.strokeRect(shx + 1, hy + 1, cellSize - 2, cellSize - 2);
      }
    }
  }, [grid, gridSize, showGrid, symmetry, hoverPos, tool]);

  return (
    <div className="flex flex-col items-center justify-center select-none" ref={containerRef}>
      {/* Canvas wrapper with retro border & checkerboard background */}
      <div className="relative p-2 sm:p-3 bg-white rounded-2xl border-2 border-slate-300 shadow-md">
        <div
          className="checkerboard-pattern rounded-xl overflow-hidden border border-slate-200 shadow-inner relative"
          style={{
            width: 'min(86vw, 480px)',
            height: 'min(86vw, 480px)',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              cursor: tool === 'picker' ? 'crosshair' : tool === 'eraser' ? 'cell' : 'default',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            className="touch-none select-none"
          />
        </div>

        {/* Bottom indicator strip */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-2 px-1">
          <div>
            {hoverPos ? (
              <span>
                좌표: ({hoverPos.x + 1}, {hoverPos.y + 1}) · {gridSize}x{gridSize}
              </span>
            ) : (
              <span>터치하거나 드래그하여 색칠하세요</span>
            )}
          </div>
          {symmetry && (
            <span className="text-purple-600 font-semibold">
              좌우 대칭 모드 켜짐
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
