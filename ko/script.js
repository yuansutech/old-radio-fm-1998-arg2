function $(s) { return document.querySelector(s); }
function $$(s) { return document.querySelectorAll(s); }
function getState() {
  try { return JSON.parse(localStorage.getItem('radio_state') || '{}'); }
  catch { return {}; }
}
function setState(patch) {
  const s = getState(); Object.assign(s, patch);
  localStorage.setItem('radio_state', JSON.stringify(s));
}
function resetState() {
  localStorage.removeItem('radio_state');
  localStorage.removeItem('radio_notes');
}
function getNotes() {
  try { return JSON.parse(localStorage.getItem('radio_notes') || '[]'); }
  catch { return []; }
}
function saveNote(text) {
  const notes = getNotes();
  if (notes.some(n => n.text === text)) return;
  notes.push({ text, time: new Date().toLocaleString('ko-KR') });
  localStorage.setItem('radio_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// 노트</h3><p style="font-size:0.8rem;color:#6e6b64;">아직 기록이 없습니다. 단서는 자동으로 저장됩니다.</p>';
    return;
  }
  panel.innerHTML = '<h3>// 노트</h3>' + notes.map(n =>
    `<div class="item">${n.text}<span class="time">${n.time}</span></div>`
  ).join('');
}
function toggleNotebook() { $('.notebook-panel').classList.toggle('open'); }
function doSearch(q) {
  if (!q) return;
  const s = q.toLowerCase().trim();
  const routes = {
    '야항선': 'home.html', '라디오': 'home.html', '수완': 'host.html',
    '진행자': 'host.html', '육침': 'about.html', '소개': 'about.html',
    '편성표': 'schedule.html', '시간표': 'schedule.html',
    '편지': 'letters.html', '청취자': 'letters.html',
    '녹음': 'broadcast-01.html', '첫 방송': 'broadcast-01.html',
    '마지막 방송': 'broadcast-03.html', '뉴스': 'news.html',
    '실종': 'missing.html', '기록': 'missing.html',
    '터미널': 'terminal.html', '해독': 'decode.html',
    '비밀번호': 'decode.html', '마지막': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('해당 파일을 찾을 수 없습니다. "편지", "녹음", "실종", "터미널"을 시도해 보세요.');
}
document.addEventListener('DOMContentLoaded', () => {
  $$('.searchbar input').forEach(input => {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(input.value); });
  });
  $$('.searchbar button').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      doSearch(input.value);
    });
  });
  if (!$('.notebook')) {
    const nb = document.createElement('div');
    nb.className = 'notebook';
    nb.innerHTML = `<button class="notebook-btn" onclick="toggleNotebook()">📓</button><div class="notebook-panel"></div>`;
    document.body.appendChild(nb);
  }
  renderNotebook();
});
