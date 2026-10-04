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
  notes.push({ text, time: new Date().toLocaleString('en-US') });
  localStorage.setItem('radio_notes', JSON.stringify(notes));
  renderNotebook();
}
function renderNotebook() {
  const panel = $('.notebook-panel');
  if (!panel) return;
  const notes = getNotes();
  if (!notes.length) {
    panel.innerHTML = '<h3>// NOTEBOOK</h3><p style="font-size:0.8rem;color:#6e6b64;">No notes yet. Clues are saved automatically.</p>';
    return;
  }
  panel.innerHTML = '<h3>// NOTEBOOK</h3>' + notes.map(n =>
    `<div class="item">${n.text}<span class="time">${n.time}</span></div>`
  ).join('');
}
function toggleNotebook() { $('.notebook-panel').classList.toggle('open'); }
function doSearch(q) {
  if (!q) return;
  const s = q.toLowerCase().trim();
  const routes = {
    'night ferry': 'home.html', 'radio': 'home.html', 'su wan': 'host.html',
    'host': 'host.html', 'lu chen': 'about.html', 'about': 'about.html',
    'schedule': 'schedule.html', 'timetable': 'schedule.html',
    'letters': 'letters.html', 'listener': 'letters.html', 'letter': 'letters.html',
    'recording': 'broadcast-01.html', 'first broadcast': 'broadcast-01.html',
    'final broadcast': 'broadcast-03.html', 'news': 'news.html',
    'missing': 'missing.html', 'file': 'missing.html',
    'terminal': 'terminal.html', 'decode': 'decode.html',
    'password': 'decode.html', 'final': 'final.html'
  };
  for (const k in routes) {
    if (s.includes(k) || k.includes(s)) { location.href = routes[k]; return; }
  }
  alert('No matching file found. Try "letters", "recording", "missing", or "terminal".');
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
