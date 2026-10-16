import { CharacterTemplate, GridSize } from '../types';

// Helper to create empty grid
export const createEmptyGrid = (size: GridSize): string[][] => {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
};

// 16x16 Slime Monster Template
const createSlime16 = (): string[][] => {
  const g = createEmptyGrid(16);
  const C_OUT = '#15803d'; // dark green border
  const C_MAIN = '#22c55e'; // green body
  const C_LIGHT = '#86efac'; // light green highlight
  const C_DARK = '#16a34a'; // inner shadow
  const C_EYE = '#0f172a'; // black eye
  const C_PUPIL = '#ffffff'; // white eye reflection
  const C_BLUSH = '#f43f5e'; // pink cheeks

  // Slime contour and fill
  const map: [number, number, string][] = [
    // Tip
    [3, 7, C_OUT], [3, 8, C_OUT],
    [4, 6, C_OUT], [4, 7, C_LIGHT], [4, 8, C_MAIN], [4, 9, C_OUT],
    [5, 5, C_OUT], [5, 6, C_LIGHT], [5, 7, C_MAIN], [5, 8, C_MAIN], [5, 9, C_MAIN], [5, 10, C_OUT],
    // Body widening
    [6, 4, C_OUT], [6, 5, C_LIGHT], [6, 6, C_LIGHT], [6, 7, C_MAIN], [6, 8, C_MAIN], [6, 9, C_MAIN], [6, 10, C_MAIN], [6, 11, C_OUT],
    [7, 3, C_OUT], [7, 4, C_LIGHT], [7, 5, C_MAIN], [7, 6, C_MAIN], [7, 7, C_MAIN], [7, 8, C_MAIN], [7, 9, C_MAIN], [7, 10, C_MAIN], [7, 11, C_MAIN], [7, 12, C_OUT],
    // Eyes row
    [8, 3, C_OUT], [8, 4, C_MAIN], [8, 5, C_EYE], [8, 6, C_MAIN], [8, 7, C_MAIN], [8, 8, C_MAIN], [8, 9, C_MAIN], [8, 10, C_EYE], [8, 11, C_MAIN], [8, 12, C_OUT],
    [9, 2, C_OUT], [9, 3, C_MAIN], [9, 4, C_BLUSH], [9, 5, C_EYE], [9, 6, C_MAIN], [9, 7, C_MAIN], [9, 8, C_MAIN], [9, 9, C_MAIN], [9, 10, C_EYE], [9, 11, C_BLUSH], [9, 12, C_MAIN], [9, 13, C_OUT],
    // Eye shine
    [8, 5, C_PUPIL], [8, 10, C_PUPIL],
    // Lower body & mouth
    [10, 2, C_OUT], [10, 3, C_MAIN], [10, 4, C_MAIN], [10, 5, C_MAIN], [10, 6, C_MAIN], [10, 7, C_OUT], [10, 8, C_OUT], [10, 9, C_MAIN], [10, 10, C_MAIN], [10, 11, C_MAIN], [10, 12, C_MAIN], [10, 13, C_OUT],
    [11, 2, C_OUT], [11, 3, C_MAIN], [11, 4, C_MAIN], [11, 5, C_MAIN], [11, 6, C_MAIN], [11, 7, C_MAIN], [11, 8, C_MAIN], [11, 9, C_MAIN], [11, 10, C_MAIN], [11, 11, C_MAIN], [11, 12, C_MAIN], [11, 13, C_OUT],
    [12, 3, C_OUT], [12, 4, C_DARK], [12, 5, C_DARK], [12, 6, C_DARK], [12, 7, C_DARK], [12, 8, C_DARK], [12, 9, C_DARK], [12, 10, C_DARK], [12, 11, C_DARK], [12, 12, C_OUT],
    // Base
    [13, 4, C_OUT], [13, 5, C_OUT], [13, 6, C_OUT], [13, 7, C_OUT], [13, 8, C_OUT], [13, 9, C_OUT], [13, 10, C_OUT], [13, 11, C_OUT],
  ];

  map.forEach(([r, c, col]) => {
    if (r < 16 && c < 16) g[r][c] = col;
  });
  return g;
};

// 16x16 Cute Cat Template
const createCat16 = (): string[][] => {
  const g = createEmptyGrid(16);
  const C_OUT = '#7c2d12'; // dark brown outline
  const C_FUR = '#f97316'; // orange fur
  const C_LIGHT = '#ffedd5'; // cream belly & muzzle
  const C_EAR = '#f43f5e'; // pink ear inside
  const C_EYE = '#0f172a'; // eyes
  const C_WHITE = '#ffffff';

  const map: [number, number, string][] = [
    // Ears
    [2, 3, C_OUT], [2, 12, C_OUT],
    [3, 2, C_OUT], [3, 3, C_EAR], [3, 4, C_OUT], [3, 11, C_OUT], [3, 12, C_EAR], [3, 13, C_OUT],
    [4, 2, C_OUT], [4, 3, C_EAR], [4, 4, C_FUR], [4, 5, C_OUT], [4, 10, C_OUT], [4, 11, C_FUR], [4, 12, C_EAR], [4, 13, C_OUT],
    // Head top
    [4, 6, C_OUT], [4, 7, C_OUT], [4, 8, C_OUT], [4, 9, C_OUT],
    [5, 2, C_OUT], [5, 3, C_FUR], [5, 4, C_FUR], [5, 5, C_FUR], [5, 6, C_FUR], [5, 7, C_FUR], [5, 8, C_FUR], [5, 9, C_FUR], [5, 10, C_FUR], [5, 11, C_FUR], [5, 12, C_FUR], [5, 13, C_OUT],
    // Eyes row
    [6, 1, C_OUT], [6, 2, C_FUR], [6, 3, C_FUR], [6, 4, C_EYE], [6, 5, C_FUR], [6, 6, C_FUR], [6, 7, C_FUR], [6, 8, C_FUR], [6, 9, C_FUR], [6, 10, C_FUR], [6, 11, C_EYE], [6, 12, C_FUR], [6, 13, C_FUR], [6, 14, C_OUT],
    [7, 1, C_OUT], [7, 2, C_FUR], [7, 3, C_FUR], [7, 4, C_WHITE], [7, 5, C_FUR], [7, 6, C_LIGHT], [7, 7, C_EAR], [7, 8, C_EAR], [7, 9, C_LIGHT], [7, 10, C_FUR], [7, 11, C_WHITE], [7, 12, C_FUR], [7, 13, C_FUR], [7, 14, C_OUT],
    // Muzzle & whiskers
    [8, 1, C_OUT], [8, 2, C_FUR], [8, 3, C_FUR], [8, 4, C_FUR], [8, 5, C_LIGHT], [8, 6, C_LIGHT], [8, 7, C_OUT], [8, 8, C_OUT], [8, 9, C_LIGHT], [8, 10, C_LIGHT], [8, 11, C_FUR], [8, 12, C_FUR], [8, 13, C_FUR], [8, 14, C_OUT],
    // Chin
    [9, 2, C_OUT], [9, 3, C_FUR], [9, 4, C_FUR], [9, 5, C_FUR], [9, 6, C_LIGHT], [9, 7, C_LIGHT], [9, 8, C_LIGHT], [9, 9, C_LIGHT], [9, 10, C_FUR], [9, 11, C_FUR], [9, 12, C_FUR], [9, 13, C_OUT],
    [10, 3, C_OUT], [10, 4, C_OUT], [10, 5, C_FUR], [10, 6, C_LIGHT], [10, 7, C_LIGHT], [10, 8, C_LIGHT], [10, 9, C_LIGHT], [10, 10, C_FUR], [10, 11, C_OUT], [10, 12, C_OUT],
    // Body & paws
    [11, 4, C_OUT], [11, 5, C_FUR], [11, 6, C_LIGHT], [11, 7, C_LIGHT], [11, 8, C_LIGHT], [11, 9, C_LIGHT], [11, 10, C_FUR], [11, 11, C_OUT],
    [12, 4, C_OUT], [12, 5, C_FUR], [12, 6, C_LIGHT], [12, 7, C_LIGHT], [12, 8, C_LIGHT], [12, 9, C_LIGHT], [12, 10, C_FUR], [12, 11, C_OUT],
    [13, 4, C_OUT], [13, 5, C_WHITE], [13, 6, C_OUT], [13, 7, C_LIGHT], [13, 8, C_LIGHT], [13, 9, C_OUT], [13, 10, C_WHITE], [13, 11, C_OUT],
    [14, 4, C_OUT], [14, 5, C_OUT], [14, 6, C_OUT], [14, 7, C_OUT], [14, 8, C_OUT], [14, 9, C_OUT], [14, 10, C_OUT], [14, 11, C_OUT],
  ];

  map.forEach(([r, c, col]) => {
    if (r < 16 && c < 16) g[r][c] = col;
  });
  return g;
};

// 16x16 Heart Template
const createHeart16 = (): string[][] => {
  const g = createEmptyGrid(16);
  const C_OUT = '#9f1239'; // deep red outline
  const C_RED = '#e11d48'; // red
  const C_LIGHT = '#fb7185'; // bright red
  const C_SHINE = '#ffffff'; // white shine

  const map: [number, number, string][] = [
    // Top arches
    [3, 4, C_OUT], [3, 5, C_OUT], [3, 10, C_OUT], [3, 11, C_OUT],
    [4, 2, C_OUT], [4, 3, C_OUT], [4, 4, C_LIGHT], [4, 5, C_RED], [4, 6, C_OUT], [4, 9, C_OUT], [4, 10, C_RED], [4, 11, C_RED], [4, 12, C_OUT], [4, 13, C_OUT],
    [5, 1, C_OUT], [5, 2, C_LIGHT], [5, 3, C_SHINE], [5, 4, C_LIGHT], [5, 5, C_RED], [5, 6, C_RED], [5, 7, C_OUT], [5, 8, C_OUT], [5, 9, C_RED], [5, 10, C_RED], [5, 11, C_RED], [5, 12, C_RED], [5, 13, C_RED], [5, 14, C_OUT],
    [6, 1, C_OUT], [6, 2, C_LIGHT], [6, 3, C_SHINE], [6, 4, C_LIGHT], [6, 5, C_RED], [6, 6, C_RED], [6, 7, C_RED], [6, 8, C_RED], [6, 9, C_RED], [6, 10, C_RED], [6, 11, C_RED], [6, 12, C_RED], [6, 13, C_RED], [6, 14, C_OUT],
    [7, 1, C_OUT], [7, 2, C_RED], [7, 3, C_LIGHT], [7, 4, C_RED], [7, 5, C_RED], [7, 6, C_RED], [7, 7, C_RED], [7, 8, C_RED], [7, 9, C_RED], [7, 10, C_RED], [7, 11, C_RED], [7, 12, C_RED], [7, 13, C_RED], [7, 14, C_OUT],
    [8, 2, C_OUT], [8, 3, C_RED], [8, 4, C_RED], [8, 5, C_RED], [8, 6, C_RED], [8, 7, C_RED], [8, 8, C_RED], [8, 9, C_RED], [8, 10, C_RED], [8, 11, C_RED], [8, 12, C_RED], [8, 13, C_OUT],
    [9, 3, C_OUT], [9, 4, C_RED], [9, 5, C_RED], [9, 6, C_RED], [9, 7, C_RED], [9, 8, C_RED], [9, 9, C_RED], [9, 10, C_RED], [9, 11, C_RED], [9, 12, C_OUT],
    [10, 4, C_OUT], [10, 5, C_RED], [10, 6, C_RED], [10, 7, C_RED], [10, 8, C_RED], [10, 9, C_RED], [10, 10, C_RED], [10, 11, C_OUT],
    [11, 5, C_OUT], [11, 6, C_RED], [11, 7, C_RED], [11, 8, C_RED], [11, 9, C_RED], [11, 10, C_OUT],
    [12, 6, C_OUT], [12, 7, C_RED], [12, 8, C_RED], [12, 9, C_OUT],
    [13, 7, C_OUT], [13, 8, C_OUT],
  ];

  map.forEach(([r, c, col]) => {
    if (r < 16 && c < 16) g[r][c] = col;
  });
  return g;
};

// 16x16 Sword Template
const createSword16 = (): string[][] => {
  const g = createEmptyGrid(16);
  const C_OUT = '#1e293b';
  const C_BLADE = '#e2e8f0';
  const C_SHINE = '#ffffff';
  const C_SHADOW = '#94a3b8';
  const C_GOLD = '#facc15';
  const C_BROWN = '#78350f';

  const map: [number, number, string][] = [
    // Tip
    [1, 14, C_OUT],
    [2, 13, C_SHINE], [2, 14, C_OUT],
    [3, 12, C_SHINE], [3, 13, C_BLADE], [3, 14, C_OUT],
    [4, 11, C_SHINE], [4, 12, C_BLADE], [4, 13, C_SHADOW], [4, 14, C_OUT],
    [5, 10, C_SHINE], [5, 11, C_BLADE], [5, 12, C_SHADOW], [5, 13, C_OUT],
    [6, 9, C_SHINE], [6, 10, C_BLADE], [6, 11, C_SHADOW], [6, 12, C_OUT],
    [7, 8, C_SHINE], [7, 9, C_BLADE], [7, 10, C_SHADOW], [7, 11, C_OUT],
    [8, 7, C_SHINE], [8, 8, C_BLADE], [8, 9, C_SHADOW], [8, 10, C_OUT],
    // Crossguard
    [8, 5, C_OUT], [8, 6, C_GOLD], [8, 11, C_GOLD], [8, 12, C_OUT],
    [9, 4, C_OUT], [9, 5, C_GOLD], [9, 6, C_GOLD], [9, 7, C_GOLD], [9, 8, C_GOLD], [9, 9, C_GOLD], [9, 10, C_GOLD], [9, 11, C_OUT],
    [10, 5, C_OUT], [10, 6, C_GOLD], [10, 7, C_BROWN], [10, 8, C_OUT],
    // Hilt / Handle
    [11, 5, C_OUT], [11, 6, C_BROWN], [11, 7, C_OUT],
    [12, 4, C_OUT], [12, 5, C_BROWN], [12, 6, C_OUT],
    // Pommel
    [13, 2, C_OUT], [13, 3, C_GOLD], [13, 4, C_GOLD], [13, 5, C_OUT],
    [14, 3, C_OUT], [14, 4, C_OUT],
  ];

  map.forEach(([r, c, col]) => {
    if (r < 16 && c < 16) g[r][c] = col;
  });
  return g;
};

// 16x16 Gold Coin Template
const createCoin16 = (): string[][] => {
  const g = createEmptyGrid(16);
  const C_OUT = '#854d0e';
  const C_MAIN = '#eab308';
  const C_LIGHT = '#fef08a';
  const C_STAR = '#ca8a04';

  const map: [number, number, string][] = [
    [3, 6, C_OUT], [3, 7, C_OUT], [3, 8, C_OUT], [3, 9, C_OUT],
    [4, 4, C_OUT], [4, 5, C_LIGHT], [4, 6, C_LIGHT], [4, 7, C_LIGHT], [4, 8, C_LIGHT], [4, 9, C_MAIN], [4, 10, C_MAIN], [4, 11, C_OUT],
    [5, 3, C_OUT], [5, 4, C_LIGHT], [5, 5, C_LIGHT], [5, 6, C_LIGHT], [5, 7, C_MAIN], [5, 8, C_MAIN], [5, 9, C_MAIN], [5, 10, C_MAIN], [5, 11, C_MAIN], [5, 12, C_OUT],
    [6, 3, C_OUT], [6, 4, C_LIGHT], [6, 5, C_LIGHT], [6, 6, C_STAR], [6, 7, C_STAR], [6, 8, C_STAR], [6, 9, C_STAR], [6, 10, C_MAIN], [6, 11, C_MAIN], [6, 12, C_OUT],
    [7, 2, C_OUT], [7, 3, C_LIGHT], [7, 4, C_LIGHT], [7, 5, C_STAR], [7, 6, C_STAR], [7, 7, C_STAR], [7, 8, C_STAR], [7, 9, C_STAR], [7, 10, C_MAIN], [7, 11, C_MAIN], [7, 12, C_MAIN], [7, 13, C_OUT],
    [8, 2, C_OUT], [8, 3, C_LIGHT], [8, 4, C_LIGHT], [8, 5, C_STAR], [8, 6, C_STAR], [8, 7, C_STAR], [8, 8, C_STAR], [8, 9, C_STAR], [8, 10, C_MAIN], [8, 11, C_MAIN], [8, 12, C_MAIN], [8, 13, C_OUT],
    [9, 3, C_OUT], [9, 4, C_MAIN], [9, 5, C_MAIN], [9, 6, C_STAR], [9, 7, C_STAR], [9, 8, C_STAR], [9, 9, C_STAR], [9, 10, C_MAIN], [9, 11, C_MAIN], [9, 12, C_OUT],
    [10, 3, C_OUT], [10, 4, C_MAIN], [10, 5, C_MAIN], [10, 6, C_MAIN], [10, 7, C_MAIN], [10, 8, C_MAIN], [10, 9, C_MAIN], [10, 10, C_MAIN], [10, 11, C_MAIN], [10, 12, C_OUT],
    [11, 4, C_OUT], [11, 5, C_MAIN], [11, 6, C_MAIN], [11, 7, C_MAIN], [11, 8, C_MAIN], [11, 9, C_MAIN], [11, 10, C_MAIN], [11, 11, C_OUT],
    [12, 6, C_OUT], [12, 7, C_OUT], [12, 8, C_OUT], [12, 9, C_OUT],
  ];

  map.forEach(([r, c, col]) => {
    if (r < 16 && c < 16) g[r][c] = col;
  });
  return g;
};

// 8x8 Simple Heart
const createHeart8 = (): string[][] => {
  const g = createEmptyGrid(8);
  const C_RED = '#ef4444';
  const C_LIGHT = '#fca5a5';
  const map: [number, number, string][] = [
    [1, 1, C_LIGHT], [1, 2, C_RED], [1, 5, C_RED], [1, 6, C_RED],
    [2, 0, C_RED], [2, 1, C_LIGHT], [2, 2, C_RED], [2, 3, C_RED], [2, 4, C_RED], [2, 5, C_RED], [2, 6, C_RED], [2, 7, C_RED],
    [3, 0, C_RED], [3, 1, C_RED], [3, 2, C_RED], [3, 3, C_RED], [3, 4, C_RED], [3, 5, C_RED], [3, 6, C_RED], [3, 7, C_RED],
    [4, 1, C_RED], [4, 2, C_RED], [4, 3, C_RED], [4, 4, C_RED], [4, 5, C_RED], [4, 6, C_RED],
    [5, 2, C_RED], [5, 3, C_RED], [5, 4, C_RED], [5, 5, C_RED],
    [6, 3, C_RED], [6, 4, C_RED],
  ];
  map.forEach(([r, c, col]) => {
    if (r < 8 && c < 8) g[r][c] = col;
  });
  return g;
};

export const TEMPLATES: CharacterTemplate[] = [
  {
    id: 'slime',
    name: '통통 슬라임',
    icon: '🟢',
    size: 16,
    grid: createSlime16(),
    description: '귀여운 초록색 게임 몬스터! 표정을 바꿔보세요.',
  },
  {
    id: 'cat',
    name: '아기 치즈냥이',
    icon: '🐱',
    size: 16,
    grid: createCat16(),
    description: '스크래치의 상징 고양이 캐릭터! 털 색깔을 바꿔보세요.',
  },
  {
    id: 'heart',
    name: '반짝 생명 하트',
    icon: '💖',
    size: 16,
    grid: createHeart16(),
    description: '게임의 HP를 나타내는 빛나는 하트 아이템입니다.',
  },
  {
    id: 'sword',
    name: '용사의 검',
    icon: '🗡️',
    size: 16,
    grid: createSword16(),
    description: '반짝이는 칼날과 황금 손잡이를 가진 모험의 검!',
  },
  {
    id: 'coin',
    name: '황금 보물 코인',
    icon: '🪙',
    size: 16,
    grid: createCoin16(),
    description: '게임 속에서 먹으면 점수가 쑥 올라가는 동전이에요.',
  },
  {
    id: 'heart8',
    name: '미니 하트 (8x8)',
    icon: '❤️',
    size: 8,
    grid: createHeart8(),
    description: '8x8 칸으로 처음 연습하기 좋은 간단한 하트입니다.',
  },
];
