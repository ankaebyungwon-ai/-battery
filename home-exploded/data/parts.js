/*
 * parts.js — 배터리팩 분해도의 부품 11개와 해체 순서
 *
 * 부품 구성과 설명은 아래 논문의 배터리팩 분해도(그림)를 근거로 한국어로 옮겼다.
 *   Klohs D, Offermanns C, Heimes H, Kampker A (2023).
 *   Automated Battery Disassembly—Examination of the Product- and Process-Related
 *   Challenges for Automotive Traction Batteries. Recycling 8(6): 89.
 *   https://doi.org/10.3390/recycling8060089  (CC BY 4.0)
 *
 * 필드
 *   key    : 분해도 레이어 이름 (exploded.js의 LAYERS와 같아야 함)
 *   side   : 설명 상자를 둘 쪽 ('L' 왼쪽, 'R' 오른쪽)
 *   at     : 지시선이 닿는 3D 점 [x, y, z] — 레이어 위의 한 점
 *   ko, en : 부품 이름
 *   desc   : 무엇인지 (논문 그림 설명을 옮김)
 *   cut    : 해체·재활용할 때 이 부품은 어떻게 되는지
 */
window.PARTS = [
  { key: 'switch',  side: 'R', at: [110, 58, 613], ko: '스위치 박스', en: 'Switch box',
    desc: '고전압 회로를 연결하고 끊는 상자. 하우징 밖에 있기도, 안에 있기도 합니다.',
    cut: '해체 전에 가장 먼저 고전압을 끊는 곳' },
  { key: 'cover',   side: 'L', at: [150, 40, 503], ko: '하우징 커버', en: 'Housing cover',
    desc: '실링을 대고 나사 약 50–100개로 고정합니다.',
    cut: '나사를 하나씩 풀어야 열려 자동화가 어려운 단계' },
  { key: 'bmc',     side: 'L', at: [60, 70, 452], ko: 'BMC · 주변 장치', en: 'BMC & peripherals',
    desc: '팩 전체를 관리하는 제어기. 냉각 부품 일부가 하우징 안에 함께 있기도 합니다.',
    cut: '전자 부품으로 따로 분리' },
  { key: 'cables',  side: 'R', at: [440, 150, 390], ko: '저전압 · 고전압 케이블', en: 'Low/high voltage cables',
    desc: '통신선(저전압)과 전력선(고전압)이 함께 지나갑니다.',
    cut: '커넥터를 일일이 빼야 해서 해체가 까다로운 부분' },
  { key: 'mmc',     side: 'L', at: [232, 80, 312], ko: 'MMC (모듈 관리 장치)', en: 'Module management controller',
    desc: '모듈이나 모듈 묶음의 데이터를 기록해, 모듈 바로 가까이 붙어 있습니다.',
    cut: '기록이 남아 있으면 재사용 진단에 도움' },
  { key: 'busbar',  side: 'R', at: [330, 220, 348], ko: '모듈 연결부', en: 'Module connection',
    desc: '고전압 케이블과 커넥터, 또는 버스바(금속 막대)로 모듈끼리 잇습니다.',
    cut: '구리 · 알루미늄으로 회수' },
  { key: 'modules', side: 'R', at: [478, 282, 262], ko: '배터리 모듈', en: 'Battery modules',
    desc: '팩 하나에 몇 개에서 수십 개까지, 차종마다 다릅니다.',
    cut: '재사용 · 재제조는 보통 이 단위로 판단' },
  { key: 'tray',    side: 'L', at: [180, 150, 186], ko: '내부 하우징 구조', en: 'Internal housing structure',
    desc: '충돌 구조를 받치고, 부품을 결합하는 기준이 됩니다.',
    cut: '금속 구조물로 회수' },
  { key: 'tray',    side: 'R', at: [520, 210, 168], ko: '하우징 트레이', en: 'Housing tray',
    desc: '모듈과 부품을 담고, 냉각 회로로 열을 넘기는 면이 됩니다.',
    cut: '금속 구조물로 회수' },
  { key: 'cooling', side: 'L', at: [300, 200, 90], ko: '냉각 회로', en: 'Cooling circuit',
    desc: '보통 하우징 바닥의 냉각판으로 액체 냉각하며, 침지 냉각도 있습니다.',
    cut: '냉각수를 빼고 냉각판을 금속으로 회수' },
  { key: 'housing', side: 'R', at: [520, 262, 20], ko: '외부 하우징 구조', en: 'External housing structure',
    desc: '안쪽이 가지처럼 갈라진 틀로, 모듈과 주변 장치를 받칩니다.',
    cut: '가장 큰 금속 덩어리 — 마지막에 분리' },
];

/* 해체 순서: 위에서부터 차례로 걷어 낸다 */
window.DISASSEMBLY = [
  { keys: ['switch'],  t: '고전압 끊기',      d: '스위치 박스에서 고전압 회로를 먼저 분리합니다. 남은 전기는 방전으로 빼냅니다.' },
  { keys: ['cover'],   t: '커버 열기',        d: '실링과 나사 수십 개를 풀어 커버를 엽니다. 논문은 이 단계를 자동화의 주요 어려움으로 꼽았습니다.', ref: 'p' },
  { keys: ['bmc'],     t: '제어기 분리',      d: 'BMC와 주변 장치를 떼어 냅니다.' },
  { keys: ['cables'],  t: '케이블 제거',      d: '저전압 · 고전압 케이블과 커넥터를 하나씩 뺍니다. 이것도 논문이 꼽은 공정상 어려움입니다.', ref: 'p' },
  { keys: ['mmc'],     t: 'MMC 분리',        d: '모듈 관리 장치를 떼고, 남은 기록은 재사용 진단에 씁니다.' },
  { keys: ['busbar'],  t: '모듈 연결 풀기',   d: '버스바와 연결 케이블을 풀어 모듈을 서로 떼어 놓습니다.' },
  { keys: ['modules'], t: '모듈 꺼내기',      d: '모듈을 들어 냅니다. 여기서 재사용 · 재제조 · 재활용으로 길이 갈립니다.' },
  { keys: ['tray', 'cooling', 'housing'], t: '구조물 회수', d: '트레이, 냉각판, 외부 하우징은 금속으로 따로 회수합니다.' },
];
