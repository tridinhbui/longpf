// Lightweight resume chatbot. Runs fully in the browser, answering from data.js.
import { profile, experience, projects, education, skills, leadership } from './data.js';

const clean = (s) => s.replace(/==(.+?)==/g, '$1');

const intents = [
  {
    keys: ['hi', 'hello', 'hey', 'xin chao', 'chào', 'chao'],
    reply: () => `Hello. I'm Long's portfolio assistant. Ask me about his experience, valuation work, skills, education, or how to reach him.`,
  },
  {
    keys: ['experience', 'worked', 'work history', 'job', 'intern', 'career', 'finbud', 'planted', 'esmart', 'role'],
    reply: () =>
      'Long has 3 finance roles:<br>' +
      experience.map((e) => `• <b>${e.role}</b>, ${e.company} <span class="muted">(${e.date})</span>`).join('<br>') +
      '<br>Highlight: improved revenue forecast accuracy by <mark>15%</mark> at FinBud AI.',
  },
  {
    keys: ['valuation', 'dcf', 'project', 'apple', 'micron', 'equity', 'research', 'pitch', 'stock', 'comps'],
    reply: () =>
      projects
        .slice(0, 2)
        .map((p) => `• <b>${p.title}</b>: ${p.metric.value} ${p.metric.label.toLowerCase()}`)
        .join('<br>') + '<br>Both built on a three-statement model with DCF and comparable company analysis.',
  },
  {
    keys: ['case', 'burger', 'consult', 'switzerland', 'competition', 'sports bra', 'clinic'],
    reply: () =>
      projects
        .slice(2)
        .map((p) => `• <b>${p.title}</b>: ${clean(p.text)}`)
        .join('<br>'),
  },
  {
    keys: ['skill', 'excel', 'tool', 'bloomberg', 'sql', 'power bi', 'model', 'certif'],
    reply: () =>
      `<b>Finance:</b> ${skills.Finance.slice(0, 6).join(', ')} and more.<br><b>Tools:</b> ${skills.Tools.join(', ')}.<br><b>Certifications:</b> ${skills.Certifications.join(', ')}.`,
  },
  {
    keys: ['education', 'school', 'mba', 'degree', 'suffolk', 'study', 'graduat', 'msf'],
    reply: () => {
      const ed = education[0];
      return `<b>${ed.school}</b><br>${ed.degrees.join('<br>')}<br><span class="muted">${ed.date}, graduating May 2027.</span>`;
    },
  },
  {
    keys: ['club', 'leader', 'volunteer', 'community'],
    reply: () => leadership.map((l) => `• <b>${l.role}</b>, ${l.org}: ${l.text}`).join('<br>'),
  },
  {
    keys: ['contact', 'email', 'phone', 'reach', 'linkedin', 'hire', 'interview', 'resume', 'cv'],
    reply: () =>
      `You can reach Long at <a href="mailto:${profile.email}">${profile.email}</a> or ${profile.phone}. He is also on <a href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn</a>.`,
  },
  {
    keys: ['available', 'open', 'looking', 'opportunit', 'start', 'when', 'visa', 'location', 'boston', 'relocat'],
    reply: () =>
      `Long is based in ${profile.location} and open to internship and full-time roles in <mark>corporate finance, FP&A, and investment analysis</mark>. For timing details, the best move is a quick email.`,
  },
];

const suggestions = ['Experience', 'Valuation work', 'Skills', 'Education', 'Contact'];

function answer(text) {
  const q = text.toLowerCase();
  // Pick the intent with the most keyword matches; more specific intents come first on ties.
  let hit = null;
  let best = 0;
  for (const i of [...intents.slice(2, 4), intents[1], ...intents.slice(4), intents[0]]) {
    const score = i.keys.filter((k) => new RegExp(`(^|[^a-z])${k}`).test(q)).length;
    if (score > best) [hit, best] = [i, score];
  }
  if (hit) return hit.reply();
  return `I can only speak to what is on Long's resume. Try asking about his experience, valuation projects, skills, or education, or email him at <a href="mailto:${profile.email}">${profile.email}</a>.`;
}

export function mountChat() {
  const root = document.createElement('div');
  root.className = 'chat';
  root.innerHTML = `
    <button class="chat-fab" aria-label="Open chat with Long's assistant">
      <svg class="chat-fab-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
      <span class="chat-fab-label">Ask about Long</span>
      <span class="chat-ping"></span>
    </button>
    <section class="chat-panel" role="dialog" aria-label="Chat with Long's assistant" hidden>
      <header class="chat-head">
        <img src="${import.meta.env.BASE_URL}long.png" alt="" />
        <div><strong>Long's Assistant</strong><span><i class="dot"></i> Online · answers from resume</span></div>
        <button class="chat-close" aria-label="Close chat">✕</button>
      </header>
      <div class="chat-body" aria-live="polite"></div>
      <div class="chat-chips">${suggestions.map((s) => `<button>${s}</button>`).join('')}</div>
      <form class="chat-form">
        <input type="text" placeholder="Ask anything about Long..." aria-label="Message" autocomplete="off" />
        <button type="submit" aria-label="Send"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </form>
    </section>`;
  document.body.appendChild(root);

  const fab = root.querySelector('.chat-fab');
  const panel = root.querySelector('.chat-panel');
  const body = root.querySelector('.chat-body');
  const form = root.querySelector('.chat-form');
  const input = form.querySelector('input');
  let greeted = false;

  const add = (html, who) => {
    const m = document.createElement('div');
    m.className = `msg ${who}`;
    m.innerHTML = html;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  };

  const botSay = (html) => {
    const typing = add('<span class="typing"><i></i><i></i><i></i></span>', 'bot');
    setTimeout(() => {
      typing.innerHTML = html;
      body.scrollTop = body.scrollHeight;
    }, 550 + Math.random() * 400);
  };

  const ask = (text) => {
    if (!text.trim()) return;
    const safe = text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    add(safe, 'user');
    botSay(answer(text));
  };

  const toggle = (open) => {
    panel.hidden = !open;
    root.classList.toggle('open', open);
    if (open && !greeted) {
      greeted = true;
      botSay(`Good day. I'm Long's assistant. He's an <mark>MBA & MS Finance candidate</mark> at Suffolk. What would you like to know?`);
    }
    if (open) setTimeout(() => input.focus(), 200);
  };

  fab.addEventListener('click', () => toggle(panel.hidden));
  root.querySelector('.chat-close').addEventListener('click', () => toggle(false));
  root.querySelectorAll('.chat-chips button').forEach((b) => b.addEventListener('click', () => ask(b.textContent)));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ask(input.value);
    input.value = '';
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && !panel.hidden && toggle(false));
}
