export type GridSize = 8 | 16 | 24;

export type ToolType = 'pencil' | 'eraser' | 'bucket' | 'picker';

export type BackgroundStyle = 'sky' | 'grid' | 'space' | 'dark' | 'transparent';

export interface CharacterTemplate {
  id: string;
  name: string;
  icon: string;
  size: GridSize;
  grid: string[][];
  description: string;
}

export interface SoundSettings {
  enabled: boolean;
}

// ---------------------------------------------------------------------------
// Block Coding Adventure (Code.org / Scratch Style) Types
// ---------------------------------------------------------------------------

export type Direction = 0 | 1 | 2 | 3; // 0: Up, 1: Right, 2: Down, 3: Left

export type BlockType =
  | 'move'
  | 'turn_right'
  | 'turn_left'
  | 'repeat'
  | 'if_path'
  | 'if_obstacle'
  | 'if_item'
  | 'collect_item';

export interface CodeBlock {
  id: string;
  type: BlockType;
  repeatCount?: number; // 2..20
  condition?: 'path_ahead' | 'obstacle_ahead' | 'item_here';
  children?: CodeBlock[]; // for repeat and if
}

export type TileType =
  | 'grass'       // non-walkable background
  | 'path'        // walkable road
  | 'obstacle'    // rock / lava / water
  | 'start'       // starting point
  | 'goal';       // treasure chest / flag

export interface MissionLevel {
  id: number;
  title: string;
  concept: string;
  story: string;
  hint: string;
  gridWidth: number;
  gridHeight: number;
  map: TileType[][]; // row x col
  startX: number;
  startY: number;
  startDir: Direction;
  goalX: number;
  goalY: number;
  items?: { x: number; y: number }[]; // optional collectible items
  allowedBlocks: BlockType[];
  maxBlocks?: number;
}
