import { MissionLevel, TileType } from '../types';

// Helper to create an empty grid map
const createMap = (width: number, height: number, defaultTile: TileType = 'grass'): TileType[][] => {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => defaultTile));
};

export const MISSIONS: MissionLevel[] = [
  // ---------------------------------------------------------------------------
  // Level 1: 방향 회전 감각
  // 앞으로 가다가 우회전하여 보물 상자 도착
  // ---------------------------------------------------------------------------
  {
    id: 1,
    title: 'Level 1: 오른쪽으로 꺾어봐요!',
    concept: '방향 회전 감각',
    story: '모험의 첫걸음! 앞으로 2칸 걷다가 오른쪽으로 몸을 돌려 황금 보물 상자를 열어보세요.',
    hint: '[앞으로 한 칸 걷기] 2번 ➡️ [오른쪽으로 돌기 ↻] ➡️ [앞으로 한 칸 걷기] 2번을 조립해보세요.',
    gridWidth: 6,
    gridHeight: 6,
    map: (() => {
      const m = createMap(6, 6, 'grass');
      m[1][1] = 'start';
      m[1][2] = 'path';
      m[1][3] = 'path';
      m[2][3] = 'path';
      m[3][3] = 'goal';
      return m;
    })(),
    startX: 1,
    startY: 1,
    startDir: 1, // Right
    goalX: 3,
    goalY: 3,
    allowedBlocks: ['move', 'turn_right', 'turn_left'],
    maxBlocks: 5,
  },

  // ---------------------------------------------------------------------------
  // Level 2: 연속 회전 & 지그재그
  // 좌회전과 우회전을 번갈아 하며 징검다리 건너기
  // ---------------------------------------------------------------------------
  {
    id: 2,
    title: 'Level 2: 꼬불꼬불 지그재그 길',
    concept: '좌회전 & 우회전 연속 감각',
    story: '왼쪽, 오른쪽을 잘 구분해야 물에 빠지지 않아요! 지그재그 길을 차근차근 건너가 볼까요?',
    hint: '내 캐릭터가 바라보는 방향을 기준으로 왼쪽과 오른쪽을 생각해보세요.',
    gridWidth: 7,
    gridHeight: 6,
    map: (() => {
      const m = createMap(7, 6, 'grass');
      m[3][1] = 'start';
      m[3][2] = 'path';
      m[2][2] = 'path';
      m[2][3] = 'path';
      m[2][4] = 'path';
      m[3][4] = 'path';
      m[3][5] = 'goal';
      return m;
    })(),
    startX: 1,
    startY: 3,
    startDir: 1, // Right
    goalX: 5,
    goalY: 3,
    allowedBlocks: ['move', 'turn_right', 'turn_left'],
    maxBlocks: 8,
  },

  // ---------------------------------------------------------------------------
  // Level 3: 반복문 입문
  // 5칸 떨어진 목표물까지 [5번 반복]으로 해결
  // ---------------------------------------------------------------------------
  {
    id: 3,
    title: 'Level 3: 마법의 반복 주문',
    concept: '반복문 (Loop) 기초',
    story: '길이 너무 길어요! [앞으로 걷기] 블록을 5개나 쓰지 않고, [5번 반복하기] 블록 1개로 해결해볼까요?',
    hint: '[__번 반복하기] 블록 안에 [앞으로 한 칸 걷기]를 쏙 넣고 숫자를 5로 설정하세요.',
    gridWidth: 8,
    gridHeight: 5,
    map: (() => {
      const m = createMap(8, 5, 'grass');
      m[2][1] = 'start';
      m[2][2] = 'path';
      m[2][3] = 'path';
      m[2][4] = 'path';
      m[2][5] = 'path';
      m[2][6] = 'goal';
      return m;
    })(),
    startX: 1,
    startY: 2,
    startDir: 1, // Right
    goalX: 6,
    goalY: 2,
    allowedBlocks: ['move', 'turn_right', 'turn_left', 'repeat'],
    maxBlocks: 2,
  },

  // ---------------------------------------------------------------------------
  // Level 4: 계단 오르기 반복
  // (앞으로 가기 + 위로 돌기) 패턴을 [3번 반복]으로 최적화
  // ---------------------------------------------------------------------------
  {
    id: 4,
    title: 'Level 4: 총총총 계단 오르기',
    concept: '반복되는 패턴 찾기',
    story: '성 꼭대기로 올라가는 계단이에요. (앞으로 1칸 ➡️ 왼쪽 돌기 ➡️ 앞으로 1칸 ➡️ 오른쪽 돌기) 규칙을 찾아보세요!',
    hint: '계단 1칸을 오르는 코드를 만들고, [3번 반복하기] 블록으로 감싸보세요.',
    gridWidth: 7,
    gridHeight: 7,
    map: (() => {
      const m = createMap(7, 7, 'grass');
      m[5][1] = 'start';
      m[5][2] = 'path';
      m[4][2] = 'path';
      m[4][3] = 'path';
      m[3][3] = 'path';
      m[3][4] = 'path';
      m[2][4] = 'goal';
      return m;
    })(),
    startX: 1,
    startY: 5,
    startDir: 1, // Right
    goalX: 4,
    goalY: 2,
    allowedBlocks: ['move', 'turn_right', 'turn_left', 'repeat'],
    maxBlocks: 5,
  },

  // ---------------------------------------------------------------------------
  // Level 5: 장애물 우회
  // 정면에 벽(돌/용암)이 있어 옆으로 돌아서 지나가기
  // ---------------------------------------------------------------------------
  {
    id: 5,
    title: 'Level 5: 거대한 바위 피하기',
    concept: '장애물 우회 경로 설계',
    story: '앗! 직진하는 길 한가운데에 커다란 바위가 떨어졌어요. 옆길로 안전하게 돌아서 목적지로 가세요.',
    hint: '바위 앞에서는 직진할 수 없어요. 왼쪽이나 오른쪽 길로 돌아서 가야 합니다.',
    gridWidth: 7,
    gridHeight: 6,
    map: (() => {
      const m = createMap(7, 6, 'grass');
      m[3][1] = 'start';
      m[3][2] = 'path';
      m[3][3] = 'obstacle'; // rock!
      m[2][2] = 'path';
      m[2][3] = 'path';
      m[2][4] = 'path';
      m[3][4] = 'path';
      m[3][5] = 'goal';
      return m;
    })(),
    startX: 1,
    startY: 3,
    startDir: 1, // Right
    goalX: 5,
    goalY: 3,
    allowedBlocks: ['move', 'turn_right', 'turn_left', 'repeat'],
    maxBlocks: 8,
  },

  // ---------------------------------------------------------------------------
  // Level 6: 사각 순환 코스
  // 반복문을 활용해 사각형 둘레를 돌아 깃발 획득
  // ---------------------------------------------------------------------------
  {
    id: 6,
    title: 'Level 6: 네모난 운동장 트랙',
    concept: '규칙적인 사각 회전 루프',
    story: '사각형 운동장을 도는 기분이에요. (3칸 걷고 오른쪽 돌기) 패턴을 반복해 목적지 깃발에 도착하세요!',
    hint: '[앞으로 3칸 걷기 ➡️ 오른쪽 돌기] 패턴을 [3번 반복]해보세요.',
    gridWidth: 7,
    gridHeight: 7,
    map: (() => {
      const m = createMap(7, 7, 'grass');
      for (let x = 1; x <= 4; x++) m[1][x] = 'path';
      for (let y = 1; y <= 4; y++) m[y][4] = 'path';
      for (let x = 4; x >= 1; x--) m[4][x] = 'path';
      m[1][1] = 'start';
      m[4][1] = 'goal';
      return m;
    })(),
    startX: 1,
    startY: 1,
    startDir: 1, // Right
    goalX: 1,
    goalY: 4,
    allowedBlocks: ['move', 'turn_right', 'turn_left', 'repeat'],
    maxBlocks: 4,
  },

  // ---------------------------------------------------------------------------
  // Level 7: 조건문과 아이템 줍기 입문
  // 반복문 안에 조건문([만약 아이템이 있으면 줍기])을 넣어 길 위의 반짝이는 보석을 모두 획득!
  // ---------------------------------------------------------------------------
  {
    id: 7,
    title: 'Level 7: 보석 길 탐험대 (조건문 입문)',
    concept: '반복문 안의 조건문 (만약 아이템이 있으면)',
    story: '직진하는 길 곳곳에 반짝이는 다이아몬드가 떨어져 있어요! 반복문 안에 [만약 여기에 아이템이 있으면 ➡️ 아이템 줍기]를 넣어 보석을 모두 챙겨 상자에 도착하세요.',
    hint: '[5번 반복하기] 안에 [앞으로 한 칸 걷기]와 [만약 여기에 아이템이 있으면 ➡️ 아이템 줍기]를 함께 쏙 넣어보세요.',
    gridWidth: 7,
    gridHeight: 5,
    map: (() => {
      const m = createMap(7, 5, 'grass');
      // Straight path from (1,2) to (5,2)
      m[2][1] = 'start';
      m[2][2] = 'path';
      m[2][3] = 'path';
      m[2][4] = 'path';
      m[2][5] = 'goal';
      return m;
    })(),
    startX: 1,
    startY: 2,
    startDir: 1, // Right
    goalX: 5,
    goalY: 2,
    items: [
      { x: 2, y: 2 },
      { x: 4, y: 2 },
    ],
    allowedBlocks: ['move', 'repeat', 'if_item', 'collect_item'],
    maxBlocks: 4,
  },

  // ---------------------------------------------------------------------------
  // Level 8: 최종 보스 미션 - 5x5 사각형 둘레 완주 & 제자리 귀환!
  // 5*5 사각형 트랙을 돌며, 아이템을 먹고 다시 출발점(제자리)으로 돌아오는 대망의 최종 탈출!
  // ---------------------------------------------------------------------------
  {
    id: 8,
    title: 'Level 8: 5x5 보석 트랙 완주 (최종 보스!)',
    concept: '반복 + 조건문의 결합 (자율 주행 알고리즘)',
    story: '마지막 8단계! 5x5 사각형 둘레를 한 바퀴 돌며 모든 보석을 먹고, 다시 원래 출발했던 제자리로 무사히 돌아오면 모험이 완성됩니다!',
    hint: '[16번 반복하기] 안에 [앞으로 한 칸 걷기], [만약 여기에 아이템이 있으면 ➡️ 줍기], [만약 앞에 장애물이 있으면 ➡️ 우회전]을 넣어보세요.',
    gridWidth: 5,
    gridHeight: 5,
    map: (() => {
      const m = createMap(5, 5, 'grass');
      // Perimeter of 5x5
      // Top row
      for (let x = 0; x < 5; x++) m[0][x] = 'path';
      // Right col
      for (let y = 0; y < 5; y++) m[y][4] = 'path';
      // Bottom row
      for (let x = 4; x >= 0; x--) m[4][x] = 'path';
      // Left col
      for (let y = 4; y >= 0; y--) m[y][0] = 'path';

      // (0,0) is both the Start and the Goal!
      m[0][0] = 'start';
      return m;
    })(),
    startX: 0,
    startY: 0,
    startDir: 1, // Right
    goalX: 0,
    goalY: 0, // returns to start position!
    items: [
      { x: 2, y: 0 },
      { x: 4, y: 2 },
      { x: 2, y: 4 },
      { x: 0, y: 2 },
    ],
    allowedBlocks: ['move', 'turn_right', 'turn_left', 'repeat', 'if_item', 'if_obstacle', 'collect_item'],
    maxBlocks: 6,
  },
];
