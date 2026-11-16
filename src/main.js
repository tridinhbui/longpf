import './style.css';
import { profile, stats, ticker, education, experience, projects, leadership, skills } from './data.js';
import { mountChat } from './chat.js';

const photo = `${import.meta.env.BASE_URL}long.png`;

// ==phrase== becomes an animated highlighter mark
const hl = (s) => s.replace(/==(.+?)==/g, '<mark class="hl">$1</mark>');

// Build a smooth SVG path from a list of values
function linePath(values, w, h, pad = 4) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => [
    pad + (i * (w - pad * 2)) / (values.length - 1),
    h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2),
  ]);
  return pts.reduce((d, [x, y], i) => {
    if (i === 0) return `M${x.toFixed(1)},${y.toFixed(1)}`;
    const [px, py] = pts[i - 1];
    const cx = (px + x) / 2;
    return `${d} C${cx.toFixed(1)},${py.toFixed(1)} ${cx.toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
  }, '');
}

const spark = (values, w = 120, h = 40) => {
  const d = linePath(values, w, h);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <path class="spark-area" d="${d} L${w - 4},${h} L4,${h} Z" />
    <path class="spark-line draw" d="${d}" pathLength="1" />
  </svg>`;
};

const heroChart = () => {
  const vals = [30, 34, 31, 38, 36, 44, 41, 50, 48, 57, 55, 66, 72];
  const w = 260;
  const h = 96;
  const d = linePath(vals, w, h, 6);
  const grid = [0.25, 0.5, 0.75].map((f) => `<line x1="0" x2="${w}" y1="${h * f}" y2="${h * f}" />`).join('');
  return `<svg class="hero-chart" viewBox="0 0 ${w} ${h}" aria-hidden="true">
    <g class="grid">${grid}</g>
    <path class="area" d="${d} L${w - 6},${h} L6,${h} Z" />
    <path class="line draw" d="${d}" pathLength="1" />
    <circle class="pulse" cx="${w - 6}" cy="${h - 6 - ((72 - 30) / 42) * (h - 12)}" r="3.5" />
  </svg>`;
};

const splitWords = (text, start = 0) =>
  text
    .split(' ')
    .map((w, i) => `<span class="word"><span style="--i:${i + start}">${w}</span></span>`)
    .join(' ');

const [first, ...rest] = profile.name.split(' ').reverse();
const nameHtml = `${splitWords(rest.reverse().join(' '))} <span class="word"><em style="--i:3">${first}</em></span>`;

const nav = `
<div class="progress" aria-hidden="true"></div>
<header class="nav">
  <div class="wrap nav-inner">
    <a href="#top" class="brand">Long Tran<span>.</span></a>
    <nav>
      <a href="#experience">Experience</a>
      <a href="#projects">Projects</a>
      <a href="#skills">Expertise</a>
      <a href="#contact" class="nav-cta">Contact</a>
    </nav>
  </div>
</header>`;

const hero = `
<section class="hero wrap" id="top">
  <div class="hero-text">
    <p class="eyebrow fade" style="--d:0s"><span class="rule"></span>${profile.title}</p>
    <h1>${nameHtml}</h1>
    <p class="lead fade" style="--d:.55s">${hl(profile.summary)}</p>
    <div class="hero-actions fade" style="--d:.7s">
      <a class="btn primary" href="mailto:${profile.email}">Get in touch</a>
      <a class="btn ghost" href="#projects">View selected work</a>
    </div>
    <p class="meta fade" style="--d:.85s">${profile.location} &nbsp;·&nbsp; Open to Corporate Finance, FP&amp;A and Investment roles</p>
  </div>
  <div class="hero-visual fade" style="--d:.3s">
    <div class="arch">
      <img src="${photo}" alt="Portrait of ${profile.short}" width="400" height="400" />
    </div>
    <div class="float-card card-chart">
      <div class="fc-head"><span>AAPL · DCF</span><span class="up">▲ 21%</span></div>
      ${heroChart()}
      <div class="fc-foot"><span>Price target</span><strong>$230</strong></div>
    </div>
    <div class="float-card card-badge">
      <span class="badge-num">+15%</span>
      <span>forecast accuracy</span>
    </div>
    <svg class="orbit" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="96" /></svg>
  </div>
</section>

<section class="wrap stats">
  ${stats
    .map(
      (s, i) => `<div class="stat reveal" style="--d:${i * 0.08}s">
        <strong><span>${s.prefix}</span><span class="count" data-to="${s.value}">0</span><span>${s.suffix}</span></strong>
        <span>${s.label}</span>
      </div>`
    )
    .join('')}
</section>

<div class="ticker" aria-hidden="true">
  <div class="ticker-track">
    ${[...ticker, ...ticker].map((t) => `<span>${t}</span><i>◆</i>`).join('')}
  </div>
</div>`;

const section = (id, num, kicker, title, body) => `
<section class="section wrap" id="${id}">
  <div class="section-head reveal">
    <span class="sec-num">${num}</span>
    <div><p class="eyebrow"><span class="rule"></span>${kicker}</p><h2>${title}</h2></div>
  </div>
  ${body}
</section>`;

const expHtml = `
<div class="timeline">
  ${experience
    .map(
      (e, i) => `
  <article class="job reveal" style="--d:${i * 0.08}s">
    <div class="job-side">
      <span class="date">${e.date}</span>
      <span class="place">${e.place}</span>
    </div>
    <div class="job-body">
      <h3>${e.role}</h3>
      <p class="company">${e.company}</p>
      <ul>${e.bullets.map((b) => `<li>${hl(b)}</li>`).join('')}</ul>
    </div>
  </article>`
    )
    .join('')}
</div>
${education
  .map(
    (ed) => `
<div class="edu reveal">
  <svg class="edu-art" viewBox="0 0 200 120" aria-hidden="true">
    <path class="draw" pathLength="1" d="M10 110 L10 60 L100 15 L190 60 L190 110" />
    <path class="draw" pathLength="1" d="M35 110 V68 M70 110 V68 M130 110 V68 M165 110 V68 M10 60 H190" />
  </svg>
  <div>
    <p class="eyebrow"><span class="rule"></span>Education</p>
    <h3>${ed.school}</h3>
    ${ed.degrees.map((d) => `<p>${d}</p>`).join('')}
  </div>
  <div class="edu-side"><span class="date">${ed.date}</span><span class="place">${ed.place}</span></div>
</div>`
  )
  .join('')}`;

const projHtml = `
<div class="cards">
  ${projects
    .map(
      (p, i) => `
  <article class="card reveal" style="--d:${(i % 2) * 0.1}s">
    <div class="card-top"><span class="tag">${p.tag}</span><span class="date">${p.date}</span></div>
    <div class="metric">
      <div><strong>${p.metric.value}</strong><span>${p.metric.label}</span></div>
      ${spark(p.spark)}
    </div>
    <h3>${p.title}</h3>
    <p>${hl(p.text)}</p>
    <p class="place">${p.place}</p>
  </article>`
    )
    .join('')}
</div>`;

const leadHtml = `
<div class="lead-grid">
  ${leadership
    .map(
      (l, i) => `
  <article class="lead-item reveal" style="--d:${i * 0.1}s">
    <span class="date">${l.date}</span>
    <h3>${l.role}</h3>
    <p class="company">${l.org}</p>
    <p>${l.text}</p>
  </article>`
    )
    .join('')}
</div>`;

const skillsHtml = `
<div class="skills">
  ${Object.entries(skills)
    .map(
      ([group, items], i) => `
  <div class="skill-group reveal" style="--d:${i * 0.08}s">
    <h3>${group}</h3>
    <div class="chips">${items.map((it, j) => `<span class="chip" style="--j:${j}">${it}</span>`).join('')}</div>
  </div>`
    )
    .join('')}
</div>`;

const contact = `
<section class="contact" id="contact">
  <svg class="contact-art" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">
    <path class="draw" pathLength="1" d="${linePath([20, 28, 24, 36, 32, 44, 40, 52, 48, 60, 58, 70, 78, 74, 88], 1200, 300, 20)}" />
  </svg>
  <div class="wrap contact-inner reveal">
    <p class="eyebrow"><span class="rule"></span>Contact<span class="rule"></span></p>
    <h2>Let’s discuss how I can add <em>value</em>.</h2>
    <p>Seeking internship and full-time opportunities in corporate finance, FP&amp;A, and investment analysis.</p>
    <div class="contact-links">
      <a href="mailto:${profile.email}">${profile.email}</a>
      <a href="tel:${profile.phone.replace(/\D/g, '')}">${profile.phone}</a>
      <a href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
    </div>
  </div>
  <footer class="wrap footer">© ${new Date().getFullYear()} ${profile.name} &nbsp;·&nbsp; ${profile.location}</footer>
</section>`;

document.querySelector('#app').innerHTML =
  nav +
  '<main>' +
  hero +
  section('experience', '01', 'Career', 'Professional Experience', expHtml) +
  section('projects', '02', 'Selected work', 'Projects &amp; <em>Valuation</em>', projHtml) +
  section('leadership', '03', 'Beyond the classroom', 'Leadership &amp; Community', leadHtml) +
  section('skills', '04', 'Toolkit', 'Expertise &amp; <em>Certifications</em>', skillsHtml) +
  '</main>' +
  contact;

mountChat();

// Count-up numbers
const countUp = (el) => {
  const to = Number(el.dataset.to);
  const dur = 1400;
  const t0 = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

// Reveal on scroll
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('.count').forEach((c) => (reduce ? (c.textContent = c.dataset.to) : countUp(c)));
      io.unobserve(en.target);
    }),
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal, .contact').forEach((el) => io.observe(el));
requestAnimationFrame(() => document.body.classList.add('loaded'));

// Scroll progress + nav shadow
const bar = document.querySelector('.progress');
const navEl = document.querySelector('.nav');
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  navEl.classList.toggle('scrolled', scrollY > 10);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Gentle parallax on hero visual
const visual = document.querySelector('.hero-visual');
if (!reduce && matchMedia('(pointer: fine)').matches) {
  addEventListener('mousemove', (e) => {
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    visual.style.setProperty('--px', x.toFixed(3));
    visual.style.setProperty('--py', y.toFixed(3));
  });
}
