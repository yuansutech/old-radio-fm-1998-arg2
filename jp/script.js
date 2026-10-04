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
  notes.push({ text, time: new Date().toLocaleString('ja-JP') });
  localStorage.setItem('radio_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// ノート</h3><p style="font-size:0.8rem;color:#6e6b64;">まだ記録はありません。手がかりは自動的に保存されます。</p>';
    return;
  }
  panel.innerHTML = '<h3>// ノート</h3>' + notes.map(n =>
    `<div class="item">${n.text}<span class="time">${n.time}</span></div>`
  ).join('');
}
function toggleNotebook() { $('.notebook-panel').classList.toggle('open'); }
function doSearch(q) {
  if (!q) return;
  const s = q.toLowerCase().trim();
  const routes = {
    '夜航船': 'home.html', 'ラジオ': 'home.html', '蘇晩': 'host.html',
    'パーソナリティ': 'host.html', '陸沈': 'about.html', '概要': 'about.html',
    '番組表': 'schedule.html', 'スケジュール': 'schedule.html',
    '手紙': 'letters.html', 'リスナー': 'letters.html',
    '録音': 'broadcast-01.html', '初回': 'broadcast-01.html',
    '最後の放送': 'broadcast-03.html', 'ニュース': 'news.html',
    '失踪': 'missing.html', '記録': 'missing.html',
    'ターミナル': 'terminal.html', '復号': 'decode.html',
    'パスワード': 'decode.html', '最後': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('該当するファイルが見つかりません。「手紙」「録音」「失踪」「ターミナル」を試してください。');
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
