/*
 * iso.js — 등각(isometric) 투영 그리기 도구
 *
 * 3D 좌표 (x, y, z)를 화면 좌표로 바꿔 SVG 문자열을 만든다.
 *   x: 오른쪽 아래로, y: 왼쪽 아래로, z: 위로
 * 빛은 항상 왼쪽 위에서 온다고 보고, 상자의 세 면을 밝기 순서대로 칠한다.
 *   [윗면(가장 밝음), 왼쪽 앞면, 오른쪽 앞면(가장 어두움)]
 */
window.ISO = (() => {
  const K = Math.cos(Math.PI / 6);   // 30° 축
  let bounds = null;                 // 그린 범위를 재고 싶을 때만 사용

  /** 3D 점 → 화면 점 [sx, sy] */
  function project(x, y, z) {
    const p = [(x - y) * K, (x + y) * 0.5 - z];
    if (bounds) {
      bounds[0] = Math.min(bounds[0], p[0]); bounds[1] = Math.min(bounds[1], p[1]);
      bounds[2] = Math.max(bounds[2], p[0]); bounds[3] = Math.max(bounds[3], p[1]);
    }
    return p;
  }
  const toPoints = list => list.map(p => project(...p).map(v => v.toFixed(1)).join(',')).join(' ');

  const EDGE = 'stroke="#0f172a" stroke-opacity=".35" stroke-width=".7" stroke-linejoin="round"';

  /** 평평한 다각형 하나 */
  const face = (pts, fill, extra = '') => `<polygon points="${toPoints(pts)}" fill="${fill}" ${extra}/>`;

  /** 상자: 원점 (x, y, z), 크기 (w, d, h), 색 [윗면, 왼쪽면, 오른쪽면] */
  function box(x, y, z, w, d, h, c) {
    return face([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], c[1], EDGE)
      + face([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], c[2], EDGE)
      + face([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], c[0], EDGE);
  }

  /** 꺾은선 (배선, 레일 등) */
  const line = (pts, stroke, width, extra = '') =>
    `<polyline points="${toPoints(pts)}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;

  /** 범위 재기 시작/끝 — 끝에서 [minX, minY, maxX, maxY] 반환 */
  const startBounds = () => { bounds = [Infinity, Infinity, -Infinity, -Infinity]; };
  const endBounds = () => { const b = bounds; bounds = null; return b; };

  return { project, face, box, line, startBounds, endBounds };
})();
