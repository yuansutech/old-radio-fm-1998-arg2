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
  notes.push({ text, time: new Date().toLocaleString('zh-CN') });
  localStorage.setItem('radio_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// 笔记本</h3><p style="font-size:0.8rem;color:#6e6b64;">还没有记录。线索会自动保存。</p>';
    return;
  }
  panel.innerHTML = '<h3>// 笔记本</h3>' + notes.map(n =>
    `<div class="item">${n.text}<span class="time">${n.time}</span></div>`
  ).join('');
}
function toggleNotebook() { $('.notebook-panel').classList.toggle('open'); }
function doSearch(q) {
  if (!q) return;
  const s = q.toLowerCase().trim();
  const routes = {
    '夜航船': 'home.html', '电台': 'home.html', '苏晚': 'host.html',
    '主持人': 'host.html', '陆沉': 'about.html', '关于': 'about.html',
    '节目表': 'schedule.html', '时间表': 'schedule.html',
    '来信': 'letters.html', '听众': 'letters.html', '信件': 'letters.html',
    '录音': 'broadcast-01.html', '第一期': 'broadcast-01.html',
    '最后一期': 'broadcast-03.html', '新闻': 'news.html',
    '失踪': 'missing.html', '档案': 'missing.html',
    '终端': 'terminal.html', '解码': 'decode.html',
    '密码': 'decode.html', '最后': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('没有找到相关文件。试试「来信」「录音」「失踪」「终端」。');
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
