/* =========================================================
   EventPulse — JavaScript
   Features:
   1. Events rendered from an array + category filter + search
   2. Countdown to the next event
   3. Digital clock (IST)
   4. Dark / light mode (saved in localStorage)
   5. Registration form validation (+ saved list of registrations)
   6. Feedback form validation
   7. Mobile menu + highlight of the section being viewed
   ========================================================= */
'use strict';

// ---- Edit this array to add / change events ----
const EVENTS = [
  { id: 'e1', name: 'Tech Quiz League', date: '2026-10-23T14:00:00+05:30', venue: 'Seminar Hall', category: 'technical',
    description: 'Rapid-fire quiz on computing, AI and internet culture. Teams of two.' },
  { id: 'e2', name: 'Git & GitHub Pages Workshop', date: '2026-11-11T11:00:00+05:30', venue: 'Computer Lab 1', category: 'workshop',
    description: 'Learn version control and publish your first website live, step by step.' },
  { id: 'e3', name: 'Talk: Building a Career in Software', date: '2026-11-18T15:00:00+05:30', venue: 'Seminar Hall', category: 'lecture',
    description: 'A senior engineer shares interview tips, project ideas and lessons from the job.' },
  { id: 'e4', name: 'Tarang: Inter-department Cultural Fest', date: '2026-11-28T16:30:00+05:30', venue: 'Main Auditorium', category: 'cultural',
    description: 'Dance, music and theatre from every department, with prizes for the best act.' },
  { id: 'e5', name: 'Arduino Build Day', date: '2026-12-09T10:00:00+05:30', venue: 'IoT Lab', category: 'workshop',
    description: 'Wire up sensors and LEDs and build a working smart gadget in one day.' },
  { id: 'e6', name: 'CodeStorm: 12-hour Hackathon', date: '2026-12-20T09:00:00+05:30', venue: 'Gurukul Campus', category: 'technical',
    description: 'Solve a real campus problem in teams of four. Judges, mentors and prizes.' }
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const LABEL = { technical: 'Technical', workshop: 'Workshop', cultural: 'Cultural', lecture: 'Lecture' };
const $ = (id) => document.getElementById(id);

/* safe localStorage helpers (private mode can throw) */
const store = {
  get(k, fallback) { try { const v = localStorage.getItem(k); return v === null ? fallback : v; } catch { return fallback; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }
};

/* ---------- 1. Events ---------- */
let activeCat = 'all';
let query = '';

function eventDate(ev) { return new Date(ev.date); }
function isPast(ev) { return eventDate(ev) < new Date(); }

function renderEvents() {
  const sorted = [...EVENTS].sort((a, b) => eventDate(a) - eventDate(b));
  let html = '';
  for (const ev of sorted) {
    const d = eventDate(ev);
    const day = d.toLocaleDateString('en-GB', { day: '2-digit', timeZone: 'Asia/Kolkata' });
    const mon = MONTHS[Number(d.toLocaleDateString('en-GB', { month: 'numeric', timeZone: 'Asia/Kolkata' })) - 1];
    const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });
    const past = isPast(ev);
    html += `
      <article class="card${past ? ' past' : ''}" data-cat="${ev.category}" data-text="${(ev.name + ' ' + ev.venue + ' ' + ev.description).toLowerCase()}">
        <div class="card-top">
          <div class="date-box"><b>${day}</b><span>${mon}</span></div>
          <span class="tag${past ? ' done' : ''}">${past ? 'Done' : LABEL[ev.category]}</span>
        </div>
        <h3>${ev.name}</h3>
        <p class="meta">📍 ${ev.venue} · ${time}</p>
        <p>${ev.description}</p>
        ${past ? '' : `<a class="go" href="#register" data-pick="${ev.id}">Register →</a>`}
      </article>`;
  }
  $('cards').innerHTML = html;

  // fill the dropdown from the same array (no duplicate data)
  $('event').innerHTML = '<option value="">Choose an event…</option>' +
    sorted.filter(e => !isPast(e)).map(e => `<option value="${e.id}">${e.name}</option>`).join('');

  $('statEvents').textContent = EVENTS.length;
  $('statUpcoming').textContent = EVENTS.filter(e => !isPast(e)).length;
}

function applyFilters() {
  let shown = 0;
  document.querySelectorAll('.card').forEach(card => {
    const okCat = activeCat === 'all' || card.dataset.cat === activeCat;
    const okText = card.dataset.text.includes(query);
    const show = okCat && okText;
    card.classList.toggle('is-hidden', !show);
    if (show) shown++;
  });
  $('none').hidden = shown !== 0;
}

$('chips').addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  activeCat = btn.dataset.cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === btn));
  applyFilters();
});
$('search').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); applyFilters(); });

// "Register →" on a card pre-selects that event in the form
$('cards').addEventListener('click', (e) => {
  const link = e.target.closest('[data-pick]');
  if (link) $('event').value = link.dataset.pick;
});

/* ---------- 2. Countdown ---------- */
function updateCountdown() {
  const now = Date.now();
  const next = EVENTS.filter(e => eventDate(e) > now).sort((a, b) => eventDate(a) - eventDate(b))[0];
  if (!next) {
    $('nextTitle').textContent = 'No upcoming events';
    $('nextMeta').textContent = 'Check back soon for the next semester.';
    ['tD','tH','tM','tS'].forEach(id => $(id).textContent = '00');
    return;
  }
  const diff = eventDate(next) - now;
  const pad = (n) => String(n).padStart(2, '0');
  $('nextTitle').textContent = next.name;
  $('nextMeta').textContent = `${next.venue} · ${eventDate(next).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' })}`;
  $('tD').textContent = pad(Math.floor(diff / 864e5));
  $('tH').textContent = pad(Math.floor(diff % 864e5 / 36e5));
  $('tM').textContent = pad(Math.floor(diff % 36e5 / 6e4));
  $('tS').textContent = pad(Math.floor(diff % 6e4 / 1e3));
}

/* ---------- 3. Clock ---------- */
function updateClock() {
  $('clock').textContent = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
}

/* ---------- 4. Dark mode ---------- */
function setMode(dark) {
  document.body.classList.toggle('dark', dark);
  $('modeBtn').textContent = dark ? '☀' : '☾';
  $('modeBtn').setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  store.set('ep-mode', dark ? 'dark' : 'light');
}
$('modeBtn').addEventListener('click', () => setMode(!document.body.classList.contains('dark')));
{
  const saved = store.get('ep-mode', null);
  setMode(saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
}

/* ---------- 5 & 6. Forms ---------- */
const RULES = {
  name:  { re: /^[A-Za-z][A-Za-z .'-]{1,59}$/, msg: 'Enter your full name (letters only, 2–60 characters).' },
  roll:  { re: /^\d{1,12}$/,                    msg: 'Roll number should be digits only (up to 12).' },
  email: { re: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/, msg: 'Enter a valid email, like name@example.com.' },
  phone: { re: /^[6-9]\d{9}$/,                  msg: 'Enter a 10-digit mobile number starting with 6–9.' },
  fbMsg: { re: /^[\s\S]{15,}$/,                 msg: 'Please write at least 15 characters.' }
};

function setError(id, msg) {
  const box = $('e-' + id);
  if (!box) return;
  box.textContent = msg;
  const field = box.closest('.field');
  if (field) field.classList.toggle('bad', Boolean(msg));
}

function check(id) {
  const el = $(id);
  const value = el.value.trim();
  let rule = RULES[id];
  if (id === 'fbName') rule = RULES.name;
  if (id === 'fbEmail') rule = RULES.email;
  if (value === '') { setError(id, 'This field is required.'); return false; }
  if (rule && !rule.re.test(value)) { setError(id, rule.msg); return false; }
  setError(id, ''); return true;
}
function checkSelect(id, msg) {
  const ok = $(id).value !== '';
  setError(id, ok ? '' : msg); return ok;
}
function checkGender(form) {
  const ok = Boolean(form.querySelector('input[name=gender]:checked'));
  setError('gender', ok ? '' : 'Please choose one option.'); return ok;
}

const regForm = $('regForm');
regForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const results = [check('name'), check('roll'), checkSelect('dept', 'Choose your department.'),
                   check('email'), check('phone'), checkGender(regForm), checkSelect('event', 'Choose an event.')];
  const status = $('regStatus');
  if (results.includes(false)) {
    status.className = 'status'; status.textContent = 'Please fix the highlighted fields.';
    const firstBad = regForm.querySelector('.bad input, .bad select');
    if (firstBad) firstBad.focus();
    return;
  }
  const ev = EVENTS.find(x => x.id === $('event').value);
  const regs = loadRegs();
  regs.push({ name: $('name').value.trim(), roll: $('roll').value.trim(), event: ev.name });
  store.set('ep-regs', JSON.stringify(regs));
  status.className = 'status ok';
  status.textContent = `Thanks ${$('name').value.trim().split(' ')[0]}! You are registered for ${ev.name}.`;
  regForm.reset();
  renderRegs();
});
// re-check a field as soon as the user edits it after an error
['name', 'roll', 'email', 'phone'].forEach(id => $(id).addEventListener('input', () => { if ($('e-' + id).textContent) check(id); }));
['dept', 'event'].forEach(id => $(id).addEventListener('change', () => checkSelect(id, 'This field is required.')));
regForm.querySelectorAll('input[name=gender]').forEach(r => r.addEventListener('change', () => checkGender(regForm)));

function loadRegs() { try { return JSON.parse(store.get('ep-regs', '[]')) || []; } catch { return []; } }
function renderRegs() {
  const regs = loadRegs();
  $('mine').hidden = regs.length === 0;
  $('mineList').innerHTML = regs.map(r => `<li>${r.name} (roll ${r.roll}) → ${r.event}</li>`).join('');
  $('statRegs').textContent = regs.length;
}
$('clearRegs').addEventListener('click', () => { store.set('ep-regs', '[]'); renderRegs(); });

const fbForm = $('fbForm');
fbForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = [check('fbName'), check('fbEmail'), check('fbMsg')];
  const status = $('fbStatus');
  if (ok.includes(false)) { status.className = 'status'; status.textContent = 'Please fix the highlighted fields.'; return; }
  status.className = 'status ok'; status.textContent = 'Thank you for your feedback!';
  fbForm.reset();
});
['fbName', 'fbEmail', 'fbMsg'].forEach(id => $(id).addEventListener('input', () => { if ($('e-' + id).textContent) check(id); }));

/* ---------- 7. Mobile menu + active section ---------- */
const burger = $('burger'), menu = $('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
});
const links = [...menu.querySelectorAll('a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
function markCurrent() {
  const y = window.scrollY + 120;
  let idx = 0;
  sections.forEach((s, i) => { if (s && s.offsetTop <= y) idx = i; });
  links.forEach((a, i) => a.classList.toggle('current', i === idx));
}
window.addEventListener('scroll', markCurrent, { passive: true });

/* ---------- your details: edit ONLY these two lines ---------- */
const SITE = { roll: '68' };            // <- your roll number
document.querySelectorAll('[data-roll]').forEach(el => { el.textContent = SITE.roll; });

/* ---------- start ---------- */
renderEvents();
renderRegs();
updateCountdown(); updateClock(); markCurrent();
setInterval(() => { updateCountdown(); updateClock(); }, 1000);
