/*
 * home.js — 분해도 아래 섹션들 (메뉴, 재활용 8단계, 처리 경로, 14개 주제)
 * 내용(STEPS, ROUTES, GROUPS)만 바꾸면 화면이 따라 바뀐다.
 */
{
const $ = id => document.getElementById(id);

/* 좁은 화면 메뉴 */
const mb = $('menuBtn'), nav = $('mainNav');
mb.addEventListener('click', () => { const o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', String(o)); });

/* ── 재활용 8단계 ── */
const STEPS = [
  ['회수 · 운송', '수명이 다한 팩을 모아 처리 시설로 옮깁니다. 손상되거나 결함이 있는 배터리는 열폭주 위험이 있어 일반 배터리와 다른 포장 규칙을 따릅니다.', '팩 단위 폐배터리', '손상 전지는 유엔 특별규정 376, 재활용용 전지는 377을 따릅니다', [4]],
  ['성능 진단', '잔존용량(SOH)을 재서 재제조·재사용·재활용 중 어디로 갈지 정합니다. 국내에서는 2027년 5월부터 떼기 전 성능평가가 법으로 정해집니다.', '진단 결과와 처리 경로', '사용후배터리법: 분리 전 성능평가, 탑재 제품 안전검사', [1, 2]],
  ['방전', '해체와 파쇄 중 불꽃이나 단락이 나지 않도록 남은 전기를 안전하게 빼냅니다.', '전기가 빠진 팩', '국내 재활용 기업은 팩·모듈을 방전·해체하는 전용 라인을 늘리고 있습니다', [5]],
  ['해체', '팩을 열어 케이블과 BMS를 분리하고, 모듈과 셀로 나눕니다. 금속 케이스와 부품은 따로 모읍니다.', '모듈 · 셀, 케이스, 배선', '성일하이텍: 케이스와 셀·모듈을 분리하는 자동화 기계. 커버 개방과 케이블 제거가 자동화의 걸림돌', [5, 9]],
  ['파쇄 · 선별', '셀을 잘게 부수고 체와 기류로 나눕니다. 금속 가루가 몰린 검은 분말이 블랙매스입니다.', '플라스틱 · 구리/알루미늄 · 블랙매스', 'Li-Cycle: 파쇄해서 세 갈래 제품으로 분리', [6]],
  ['침출', '블랙매스를 산에 녹여 리튬·니켈·코발트·망간을 용액으로 옮깁니다. 흑연 같은 녹지 않는 물질은 걸러 냅니다.', '금속이 녹은 용액', '습식제련의 첫 단계 — 성일하이텍은 이 용액을 용매추출로 처리합니다', [5]],
  ['용매추출 · 결정화', '용액에서 금속을 하나씩 분리하고, 각각을 결정으로 만듭니다.', '황산니켈 · 황산코발트 · 황산망간 · 탄산리튬', '성일하이텍: 용매추출로 네 가지 원료 공급', [5]],
  ['새 양극재로', '되찾은 원료는 다시 전구체와 양극재가 되어 새 배터리에 들어갑니다.', '양극재 원료 → 새 배터리', 'Umicore: 회수한 배터리급 소재로 새 양극재를 만든다고 발표', [7]],
];
const flow = $('flow'), box2 = $('stepBox');
flow.innerHTML = STEPS.map((s, i) => `<li><button type="button" role="tab" id="st${i}" aria-controls="stepBox" aria-selected="false" data-i="${i}"><span class="dot">${i + 1}</span><span class="t">${s[0]}</span></button></li>`).join('');
const cites = a => a.map(n => `<a class="cite" href="#s${n}">[${n}]</a>`).join('');
let step = 0;
function show(i) {
  step = i;
  flow.querySelectorAll('li').forEach((li, k) => { li.classList.toggle('done', k < i); const b = li.querySelector('button'); b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
  const [t, d, out, ex, r] = STEPS[i];
  box2.setAttribute('aria-labelledby', `st${i}`);
  box2.innerHTML = `<div class="stepmain"><span class="n">${i + 1} / ${STEPS.length}</span><h3>${t}</h3><p>${d}</p></div><dl class="stepside" style="margin:0"><div><dt>나오는 것</dt><dd>${out}</dd></div><div><dt>실제 사례</dt><dd>${ex} ${cites(r)}</dd></div></dl>`;
  $('stepPrev').disabled = i === 0; $('stepNext').disabled = i === STEPS.length - 1;
}
flow.addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); });
flow.addEventListener('keydown', e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { e.preventDefault(); const n = Math.max(0, Math.min(STEPS.length - 1, step + d)); show(n); $(`st${n}`).focus(); } });
$('stepPrev').onclick = () => step > 0 && show(step - 1);
$('stepNext').onclick = () => step < STEPS.length - 1 && show(step + 1);
show(0);

/* ── 세 갈래 ── */
const ROUTES = [
  ['재제조', '성능이 떨어진 셀이나 모듈만 바꿔 다시 전기차용으로', '원래 용도로 돌아가는 가장 짧은 길입니다. 진단으로 약한 모듈을 찾아 교체하고 나머지는 그대로 씁니다.', ['약한 모듈만 교체, 나머지는 재사용', '다시 전기차에 들어가므로 안전검사가 중요'], '대부분 모듈이 건강하고 일부만 약할 때', '/topics/remanufacturing'],
  ['재사용', '자동차엔 부족해도 에너지저장장치(ESS)엔 충분하다', '주행에는 부족해진 배터리를 태양광 옆 ESS, 비상 전원처럼 덜 까다로운 곳에서 다시 씁니다.', ['국내는 재사용전지 안전성 검사를 거쳐야 함', 'LAB 01은 이런 ESS의 과열 감지를 모형으로 실험'], '용량은 줄었지만 고르게 남아 있을 때', '/topics/reuse'],
  ['재활용', '부수고 녹여 원료로 되돌린다', '더 쓰기 어려운 배터리는 위의 여덟 단계를 거쳐 리튬·니켈·코발트 원료로 돌아갑니다.', ['습식, 건식+습식, 양극재를 그대로 되살리는 직접 재활용이 있음', 'EU는 리튬 회수율 목표를 법으로 정함'], '손상됐거나 용량이 많이 줄었을 때', '/topics/recycling'],
];
const rt = $('routeTabs'), rp = $('routePanel');
rt.innerHTML = ROUTES.map((r, i) => `<button type="button" role="tab" id="rt${i}" aria-controls="routePanel" aria-selected="false" data-i="${i}">${r[0]}</button>`).join('');
function route(i) {
  rt.querySelectorAll('button').forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
  const [n, one, d, pts, when, href] = ROUTES[i];
  rp.setAttribute('aria-labelledby', `rt${i}`);
  rp.innerHTML = `<div><h3>${n} — ${one}</h3><p>${d}</p><ul>${pts.map(p => `<li>${p}</li>`).join('')}</ul></div><aside><b>이럴 때</b><p>${when}</p><b>더 읽기</b><p><a href="${href}">${n} 주제 페이지 →</a></p></aside>`;
}
rt.addEventListener('click', e => { const b = e.target.closest('button'); if (b) route(+b.dataset.i); });
rt.addEventListener('keydown', e => { const cur = [...rt.children].findIndex(b => b.getAttribute('aria-selected') === 'true'), d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { e.preventDefault(); const n = (cur + d + 3) % 3; route(n); $(`rt${n}`).focus(); } });
route(0);

/* ── 14개 주제 ── */
const GROUPS = [
  ['처리 경로', '무엇을 할 것인가', [['01', '재제조', 'remanufacturing'], ['02', '재사용', 'reuse'], ['03', '재활용', 'recycling'], ['04', '업사이클링', 'upcycling']]],
  ['지원 기술', '무엇이 있어야 가능한가', [['05', '잔존수명 진단', 'soh-diagnosis'], ['06', '안전 관리', 'safety'], ['07', '자동화 해체', 'automated-disassembly'], ['08', '부산물 회수', 'byproduct-recovery'], ['09', '이력관리', 'traceability'], ['10', '재생원료 인증', 'certification']]],
  ['평가', '좋은지 어떻게 판단하는가', [['11', '전과정평가', 'lca'], ['12', '기술경제성 분석', 'techno-economic'], ['13', '공급망 · 자원안보', 'supply-chain']]],
  ['설계', '애초에 어떻게 만들 것인가', [['14', '분해를 고려한 설계', 'design-for-disassembly']]],
];
document.querySelector('#topicTable tbody').innerHTML = GROUPS.map(([g, q, ts]) => `<tr><th scope="row">${g}<small>${q}</small></th><td><ul>${ts.map(([n, t, s]) => `<li><a href="/topics/${s}"><span>${n}</span><b>${t}</b></a></li>`).join('')}</ul></td></tr>`).join('');
}
