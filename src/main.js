import './style.css';
import { profile, stats, education, experience, projects, leadership, skills } from './data.js';

const photo = `${import.meta.env.BASE_URL}long.png`;

const nav = `
<header class="nav">
  <div class="wrap nav-inner">
    <a href="#top" class="brand">LT<span>.</span></a>
    <nav>
      <a href="#experience">Experience</a>
      <a href="#projects">Projects</a>
      <a href="#skills">Skills</a>
      <a href="#contact" class="nav-cta">Contact</a>
    </nav>
  </div>
</header>`;

const hero = `
<section class="hero wrap" id="top">
  <div class="hero-text reveal">
    <p class="eyebrow">${profile.title}</p>
    <h1>${profile.name}</h1>
    <p class="lead">${profile.summary}</p>
    <div class="hero-actions">
      <a class="btn primary" href="mailto:${profile.email}">Get in touch</a>
      <a class="btn" href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
    </div>
    <p class="meta">📍 ${profile.location} · Open to Finance, FP&amp;A and Corporate Finance roles</p>
  </div>
  <div class="hero-photo reveal">
    <img src="${photo}" alt="Portrait of ${profile.short}" width="400" height="400" />
  </div>
</section>
<section class="wrap stats reveal">
  ${stats.map((s) => `<div class="stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join('')}
</section>`;

const section = (id, kicker, title, body) => `
<section class="section wrap" id="${id}">
  <div class="section-head reveal"><p class="eyebrow">${kicker}</p><h2>${title}</h2></div>
  ${body}
</section>`;

const expHtml = `
<div class="timeline">
  ${experience
    .map(
      (e) => `
  <article class="job reveal">
    <div class="job-side"><span class="date">${e.date}</span><span class="place">${e.place}</span></div>
    <div class="job-body">
      <h3>${e.role}</h3>
      <p class="company">${e.company}</p>
      <ul>${e.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
    </div>
  </article>`
    )
    .join('')}
</div>
${education
  .map(
    (ed) => `
<div class="edu reveal">
  <div>
    <p class="eyebrow">Education</p>
    <h3>${ed.school}</h3>
    ${ed.degrees.map((d) => `<p>${d}</p>`).join('')}
  </div>
  <div class="job-side"><span class="date">${ed.date}</span><span class="place">${ed.place}</span></div>
</div>`
  )
  .join('')}`;

const projHtml = `
<div class="cards">
  ${projects
    .map(
      (p) => `
  <article class="card reveal">
    <div class="card-top"><span class="tag">${p.tag}</span><span class="date">${p.date}</span></div>
    <div class="metric"><strong>${p.metric.value}</strong><span>${p.metric.label}</span></div>
    <h3>${p.title}</h3>
    <p>${p.text}</p>
    <p class="place">${p.place}</p>
  </article>`
    )
    .join('')}
</div>`;

const leadHtml = `
<div class="lead-grid">
  ${leadership
    .map(
      (l) => `
  <article class="lead-item reveal">
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
      ([group, items]) => `
  <div class="skill-group reveal">
    <h3>${group}</h3>
    <div class="chips">${items.map((i) => `<span class="chip">${i}</span>`).join('')}</div>
  </div>`
    )
    .join('')}
</div>`;

const contact = `
<section class="contact" id="contact">
  <div class="wrap contact-inner reveal">
    <p class="eyebrow">Contact</p>
    <h2>Let’s talk numbers.</h2>
    <p>I’m seeking internship and full-time opportunities in corporate finance, FP&amp;A, and investment analysis.</p>
    <div class="contact-links">
      <a href="mailto:${profile.email}">${profile.email}</a>
      <a href="tel:${profile.phone.replace(/\D/g, '')}">${profile.phone}</a>
      <a href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
    </div>
  </div>
  <footer class="wrap footer">© ${new Date().getFullYear()} ${profile.name} · ${profile.location}</footer>
</section>`;

document.querySelector('#app').innerHTML =
  nav +
  '<main>' +
  hero +
  section('experience', 'Career', 'Experience', expHtml) +
  section('projects', 'Selected work', 'Projects &amp; Valuation', projHtml) +
  section('leadership', 'Beyond the classroom', 'Leadership &amp; Community', leadHtml) +
  section('skills', 'Toolkit', 'Skills &amp; Certifications', skillsHtml) +
  '</main>' +
  contact;

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
