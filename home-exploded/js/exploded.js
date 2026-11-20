/*
 * exploded.js — 메인 화면의 배터리팩 분해도
 *
 * 1) 레이어 10층을 위아래로 띄워 등각 투영으로 그린다 (LAYERS)
 * 2) 부품마다 설명 상자를 좌우에 두고 지시선으로 잇는다 (layout)
 *    - 상자 실제 높이를 재서 같은 쪽 상자끼리 겹치지 않게 위아래로 민다
 * 3) 상자를 누르면 그 레이어만 강조하고, '해체 순서'를 재생하면
 *    위층부터 차례로 걷어 낸다 (select, showStep)
 *
 * 화면이 좁으면(1000px 미만) 지시선을 숨기고 번호 표지만 남긴 채,
 * 설명 상자는 그림 아래 목록으로 내려간다.
 */
(() => {
  const { box, face, line, project, startBounds, endBounds } = window.ISO;
  const PARTS = window.PARTS, STEPS = window.DISASSEMBLY;
  const $ = id => document.getElementById(id);

  /* 색: 실제 팩처럼 무채색 금속 + 고전압 주황. [윗면, 왼쪽 면, 오른쪽 면] */
  const C = {
    housing: ['#a3aab3', '#7b838d', '#646b75'],
    rib:     ['#b4bac2', '#8a919b', '#737a84'],
    cool:    ['#e6eaef', '#c2c9d2', '#aab2bc'],
    tray:    ['#5a616b', '#41474f', '#33383f'],
    pad:     '#e4b9cc',
    module:  ['#5d646e', '#3d434b', '#30353c'],
    black:   ['#3f444c', '#25292f', '#1b1e23'],
    cover:   ['#474d56', '#30353c', '#262a30'],
    copper:  ['#ef9a62', '#c25a17', '#a24b12'],
    hv:      '#d9611a',
  };
  const W = 520, D = 300;   // 팩 바닥 크기 (임의 단위)

  /* ── 1. 레이어 (아래층부터 그려야 겹침이 맞음) ── */
  const LAYERS = {
    housing() {   // 외부 하우징: 테두리 + 안쪽 가지 모양 리브 + 차체 고정 탭
      let s = '';
      for (const x of [60, 220, 380]) s += box(x, D, 0, 40, 18, 10, C.housing);
      s += box(0, 0, 0, W, D, 40, C.housing);
      s += face([[12, 12, 40], [W - 12, 12, 40], [W - 12, D - 12, 40], [12, D - 12, 40]], '#8b929c');
      for (let x = 70; x < W; x += 75) s += box(x, 14, 40, 6, D - 28, 5, C.rib);
      s += box(14, D / 2 - 3, 40, W - 28, 6, 5, C.rib);
      return s;
    },
    cooling() {   // 냉각판: 얇은 판 + 구불구불한 냉각수 통로 + 입출구
      let s = box(24, 24, 85, W - 48, D - 48, 5, C.cool);
      const path = [];
      for (let i = 0; i < 6; i++) {
        const y = 46 + i * 42, l = [46, y, 90.5], r = [W - 46, y, 90.5];
        path.push(...(i % 2 ? [r, l] : [l, r]));
      }
      s += line(path, '#7f97b5', 3);
      s += box(W - 24, 40, 84, 22, 12, 8, C.cool) + box(W - 24, 70, 84, 22, 12, 8, C.cool);
      return s;
    },
    tray() {      // 하우징 트레이 + 내부 구조(격자 벽) + 열전도 패드(분홍)
      let s = box(6, 6, 150, W - 12, D - 12, 36, C.tray);
      s += face([[16, 16, 158], [W - 16, 16, 158], [W - 16, D - 16, 158], [16, D - 16, 158]], '#2c3036');
      for (let r = 0; r < 2; r++) for (let c = 0; c < 7; c++) {
        const x = 24 + c * 70, y = 26 + r * 132;
        s += face([[x, y, 158.5], [x + 56, y, 158.5], [x + 56, y + 114, 158.5], [x, y + 114, 158.5]], C.pad, 'opacity=".9"');
      }
      for (let c = 1; c < 7; c++) s += box(16 + c * 70 - 3, 16, 158, 5, D - 32, 26, C.tray);
      s += box(16, D / 2 - 4, 158, W - 32, 8, 26, C.tray);
      return s;
    },
    modules() {   // 배터리 모듈 2줄 × 7개
      const list = [];
      for (let r = 0; r < 2; r++) for (let c = 0; c < 7; c++) list.push([16 + c * 70, 20 + r * 136]);
      list.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));   // 뒤 → 앞
      return list.map(([x, y]) => {
        let s = box(x, y, 235, 64, 124, 44, C.module);
        for (let k = 1; k < 8; k++) s += line([[x + k * 8, y + 124, 241], [x + k * 8, y + 124, 273]], '#59606a', .8);
        s += box(x + 6, y + 4, 279, 10, 10, 4, C.copper) + box(x + 48, y + 4, 279, 10, 10, 4, ['#cfd5dc', '#9aa3ae', '#86909b']);   // 단자
        return s;
      }).join('');
    },
    mmc() {       // 모듈 관리 장치: 모듈 열마다 작은 상자 + 연결선
      let s = line([[47, 90, 306], [W - 33, 90, 306]], '#2a2e35', 1.6);
      for (let c = 0; c < 7; c++) s += box(30 + c * 70, 70, 300, 34, 40, 12, C.black);
      return s;
    },
    busbar() {    // 모듈 연결부: 구리 버스바 + 고전압 고리(주황)
      let s = line([[20, 20, 346], [W - 20, 20, 346], [W - 20, D - 20, 346], [20, D - 20, 346], [20, 120, 346]], C.hv, 3.5);
      for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) s += box(58 + c * 70, 70 + r * 136, 345, 56, 12, 3, C.copper);
      return s;
    },
    cables() {    // 저전압(검정) 간선과 가지, 커넥터
      let s = line([[60, 110, 390], [40, 150, 390], [W - 40, 150, 390]], '#1f2329', 2.6);
      for (let i = 0; i < 6; i++) {
        const x = 80 + i * 72;
        s += line([[x, 150, 390], [x + 10, 186, 390]], '#1f2329', 2) + box(x + 6, 184, 388, 16, 10, 6, C.black);
      }
      s += line([[W - 40, 150, 390], [W - 40, 240, 390]], C.hv, 3) + box(W - 48, 236, 387, 16, 16, 7, C.copper);
      return s;
    },
    bmc() {       // 팩 제어기(BMC)와 주변 장치
      return box(28, 44, 430, 78, 54, 22, C.black) + box(40, 120, 430, 26, 26, 30, C.black)
        + face([[40, 52, 452.4], [80, 52, 452.4], [80, 64, 452.4], [40, 64, 452.4]], '#5b616a')
        + line([[53, 120, 455], [62, 98, 448]], '#1f2329', 2);
    },
    cover() {     // 하우징 커버 + 둘레 나사
      let s = box(0, 0, 495, W, D, 8, C.cover);
      for (let x = 130; x < W; x += 130) s += line([[x, 6, 503.5], [x, D - 6, 503.5]], '#565c65', 1);
      s += face([[34, 26, 503.6], [176, 26, 503.6], [176, 90, 503.6], [34, 90, 503.6]], '#61676f');   // 스위치 박스 자리
      const screw = (x, y) => line([[x, y, 510], [x, y, 524]], '#a7afb9', 2.2) + face([[x - 4, y - 4, 524], [x + 4, y - 4, 524], [x + 4, y + 4, 524], [x - 4, y + 4, 524]], '#c2c9d1');
      for (let x = 20; x <= W - 20; x += 40) s += screw(x, 8);
      for (let y = 48; y <= D - 48; y += 40) s += screw(8, y);
      for (let y = 48; y <= D - 48; y += 40) s += screw(W - 8, y);
      for (let x = 20; x <= W - 20; x += 40) s += screw(x, D - 8);
      return s;
    },
    switch() {    // 스위치 박스 + 고전압 커넥터(주황)
      return box(40, 30, 585, 130, 56, 28, C.black)
        + face([[52, 40, 613.4], [100, 40, 613.4], [100, 54, 613.4], [52, 54, 613.4]], '#5b616a')
        + box(122, 86, 592, 18, 12, 14, C.copper) + box(146, 86, 592, 18, 12, 14, C.copper);
    },
  };
  const ORDER = ['housing', 'cooling', 'tray', 'modules', 'mmc', 'busbar', 'cables', 'bmc', 'cover', 'switch'];

  /* ── 2. 그림 + 설명 상자 ── */
  const stage = $('xstage'), svg = $('xsvg'), list = $('xlabels');
  const COL = 330, GAP = 56, PAD = 28;   // 상자 칸 너비 · 그림과의 간격 · 여백 (viewBox 단위)
  const narrow = matchMedia('(max-width: 999px)');
  let full, tight, anchors, layerSvg;

  startBounds();
  layerSvg = ORDER.map(k => `<g class="ly" data-k="${k}">${LAYERS[k]()}</g>`).join('');
  anchors = PARTS.map(p => project(...p.at));
  const [x0, y0, x1, y1] = endBounds();
  tight = [x0 - PAD, y0 - PAD, x1 - x0 + PAD * 2, y1 - y0 + PAD * 2];
  full = [x0 - COL - GAP, y0 - PAD, x1 - x0 + (COL + GAP) * 2, y1 - y0 + PAD * 2];

  list.innerHTML = PARTS.map((p, i) => `<li class="xl ${p.side}">
      <button type="button" data-i="${i}" aria-pressed="false"><span class="no">${i + 1}</span><span class="nm">${p.ko}<small lang="en">${p.en}</small></span></button>
      <p>${p.desc}</p><p class="cut">${p.cut}</p></li>`).join('');

  // 번호 표지. 좁은 화면에서는 그림이 작아지므로 k배 키워 손가락으로 누를 수 있게 한다
  const badge = (i, [x, y], k = 1) => `<g class="badge" data-i="${i}" role="presentation"><circle cx="${x}" cy="${y}" r="${12 * k}" fill="#0f172a" stroke="#fff" stroke-width="${2 * k}"/><text x="${x}" y="${(y + 4.3 * k).toFixed(1)}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="${12.5 * k}" font-weight="600" fill="#fff">${i + 1}</text></g>`;

  function layout() {
    const wide = !narrow.matches;
    stage.classList.toggle('wide', wide);
    let v = wide ? full : tight;
    svg.setAttribute('viewBox', v.map(n => n.toFixed(1)).join(' '));
    if (!wide) {   // 좁은 화면: 번호 표지만
      svg.innerHTML = layerSvg + PARTS.map((p, i) => badge(i, anchors[i], 1.9)).join('');
      list.querySelectorAll('.xl').forEach(li => li.removeAttribute('style'));
      return paint();
    }
    // 넓은 화면: 상자 높이를 재서 겹치지 않게 배치
    const scale = svg.getBoundingClientRect().width / v[2];   // 너비가 고정이라 높이를 늘려도 배율은 같음
    const items = [...list.children].map((li, i) => ({ li, i, side: PARTS[i].side, h: li.offsetHeight / scale, y: anchors[i][1] }));
    const gap = 14 / scale;
    // 한쪽 상자를 다 쌓은 높이가 그림보다 길면, 그림 위아래 여백을 늘린다
    const need = Math.max(...['L', 'R'].map(sd => items.filter(o => o.side === sd).reduce((t, o) => t + o.h + gap, 0))) + 8;
    if (need > v[3]) {
      const extra = need - v[3];
      v = [v[0], v[1] - extra / 2, v[2], need];
      svg.setAttribute('viewBox', v.map(n => n.toFixed(1)).join(' '));
    }
    const top = v[1] + 4, bottom = v[1] + v[3] - 4;
    for (const side of ['L', 'R']) {
      const col = items.filter(o => o.side === side).sort((a, b) => a.y - b.y);
      // 상자 중심 = 지시점 높이에서 출발, 아래로 밀기
      let edge = top;
      for (const o of col) { o.t = Math.max(o.y - o.h / 2, edge); edge = o.t + o.h + gap; }
      // 바닥을 넘으면 위로 되밀기
      edge = bottom;
      for (const o of col.slice().reverse()) { if (o.t + o.h > edge) o.t = edge - o.h; edge = o.t - gap; }
    }
    let leads = '';
    for (const o of items) {
      const left = o.side === 'L' ? v[0] : v[0] + v[2] - COL;
      o.li.style.cssText = `left:${((left - v[0]) / v[2] * 100).toFixed(3)}%;top:${((o.t - v[1]) / v[3] * 100).toFixed(3)}%;width:${(COL / v[2] * 100).toFixed(3)}%`;
      const [ax, ay] = anchors[o.i], ly = o.t + 22 / scale;          // 상자 제목 줄 높이에 맞춤
      const ex = o.side === 'L' ? left + COL + 4 : left - 4, kx = o.side === 'L' ? ex + 18 : ex - 18;
      leads += `<polyline class="lead" data-i="${o.i}" points="${ex.toFixed(1)},${ly.toFixed(1)} ${kx.toFixed(1)},${ly.toFixed(1)} ${ax.toFixed(1)},${ay.toFixed(1)}" fill="none"/>`;
    }
    svg.innerHTML = layerSvg + leads + PARTS.map((p, i) => badge(i, anchors[i])).join('');
    paint();
  }

  /* ── 3. 강조 상태 ── */
  const state = { on: [], gone: [], labels: [] };
  function paint() {
    stage.classList.toggle('sel', state.on.length > 0);
    svg.querySelectorAll('.ly').forEach(g => {
      g.classList.toggle('on', state.on.includes(g.dataset.k));
      g.classList.toggle('gone', state.gone.includes(g.dataset.k));
    });
    svg.querySelectorAll('.lead, .badge').forEach(g => g.classList.toggle('on', state.labels.includes(+g.dataset.i)));
    list.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(state.labels.includes(+b.dataset.i))));
    list.querySelectorAll('.xl').forEach((li, i) => li.classList.toggle('on', state.labels.includes(i)));
  }
  const status = $('xstatus'), IDLE = '번호나 부품 이름을 누르면 그 층만 밝아집니다. 해체 순서를 재생하면 위층부터 걷어 냅니다.';
  const set = (on, gone, labels, html) => { Object.assign(state, { on, gone, labels }); paint(); status.innerHTML = html; };

  let picked = null;
  function select(i) {
    stop(); si = -1; syncStepBtns();
    picked = picked === i ? null : i;
    if (picked === null) return set([], [], [], IDLE);
    const p = PARTS[picked];
    set([p.key], [], [picked], `<b>${picked + 1}. ${p.ko}</b> — ${p.desc} <span class="cutnote">${p.cut}</span>`);
  }
  list.addEventListener('click', e => { const b = e.target.closest('button'); if (b) select(+b.dataset.i); });
  svg.addEventListener('click', e => { const g = e.target.closest('.badge'); if (g) select(+g.dataset.i); });

  /* 해체 순서: 지금 단계는 강조, 앞 단계에서 뗀 층은 흐리게 */
  const playBtn = $('xplay'), prevBtn = $('xprev'), nextBtn = $('xnext'), stepNo = $('xstepno');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let si = -1, timer = null;
  function syncStepBtns() {
    prevBtn.disabled = si <= 0;
    nextBtn.disabled = si >= STEPS.length - 1;
    stepNo.textContent = si < 0 ? `0 / ${STEPS.length}` : `${si + 1} / ${STEPS.length}`;
  }
  function showStep(n) {
    si = n; picked = null;
    const s = STEPS[n];
    const gone = STEPS.slice(0, n).flatMap(x => x.keys);
    const labels = PARTS.map((p, i) => s.keys.includes(p.key) ? i : -1).filter(i => i >= 0);
    set(s.keys, gone, labels, `<b>${n + 1}. ${s.t}</b> — ${s.d}${s.ref ? ' <a class="cite" href="#s9">[9]</a>' : ''}`);
    syncStepBtns();
  }
  function stop() { clearInterval(timer); timer = null; playBtn.textContent = '해체 순서 재생'; playBtn.setAttribute('aria-pressed', 'false'); }
  playBtn.addEventListener('click', () => {
    if (timer) return stop();
    showStep(si < 0 || si >= STEPS.length - 1 ? 0 : si + 1);
    if (reduce) return;   // 움직임 줄이기 설정이면 한 단계씩만
    playBtn.textContent = '일시정지'; playBtn.setAttribute('aria-pressed', 'true');
    timer = setInterval(() => si >= STEPS.length - 1 ? stop() : showStep(si + 1), 2800);
  });
  prevBtn.addEventListener('click', () => { stop(); if (si > 0) showStep(si - 1); });
  nextBtn.addEventListener('click', () => { stop(); showStep(Math.min(STEPS.length - 1, si + 1)); });
  $('xreset').addEventListener('click', () => { stop(); si = -1; picked = null; syncStepBtns(); set([], [], [], IDLE); });

  /* 시작 */
  status.textContent = IDLE;
  syncStepBtns();
  layout();
  narrow.addEventListener('change', layout);
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 120); });
  if (document.fonts) document.fonts.ready.then(layout);   // 글꼴이 늦게 오면 상자 높이가 바뀜
})();
