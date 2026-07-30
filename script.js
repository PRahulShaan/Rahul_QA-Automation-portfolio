// ==========================================================================
// RAHUL PALANISAMY — PORTFOLIO
// ==========================================================================

document.getElementById('year').textContent = new Date().getFullYear();

/* -------------------------------------------------------------------------
   Nav: scrolled state + scroll progress + mobile toggle
   ------------------------------------------------------------------------- */
const nav = document.getElementById('nav');
const progressFill = document.getElementById('progressFill');

function onScroll() {
  const scrollTop = window.scrollY;
  nav.classList.toggle('scrolled', scrollTop > 20);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressFill.style.width = pct + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  const open = navToggle.classList.toggle('is-open');
  navLinks.style.display = open ? 'flex' : '';
  if (open) {
    navLinks.style.position = 'fixed';
    navLinks.style.top = '64px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.flexDirection = 'column';
    navLinks.style.gap = '0';
    navLinks.style.background = 'rgba(10,10,10,0.98)';
    navLinks.style.borderBottom = '1px solid #262626';
    navLinks.style.padding = '8px 24px 20px';
  }
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('is-open');
    if (window.innerWidth <= 900) navLinks.style.display = '';
  });
});

/* -------------------------------------------------------------------------
   Scroll cue: click to jump to About
   ------------------------------------------------------------------------- */
const scrollCue = document.getElementById('scrollCue');
if (scrollCue) {
  scrollCue.addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  });
}

/* -------------------------------------------------------------------------
   Reveal-on-scroll for hero elements + section content
   ------------------------------------------------------------------------- */
const revealTargets = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => revealObserver.observe(el));

// Fade sections in gently as they enter view
const sectionEls = document.querySelectorAll('.section-head, .skill-card, .project-card, .pipe-step, .tl-item, .fact');
sectionEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(14px)';
  el.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
});
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
sectionEls.forEach(el => sectionObserver.observe(el));

/* -------------------------------------------------------------------------
   Animated stat counters
   ------------------------------------------------------------------------- */
const counters = document.querySelectorAll('.fact-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const isDecimal = String(target).includes('.');
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = isDecimal ? target.toFixed(1) : target;
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(el => counterObserver.observe(el));

/* -------------------------------------------------------------------------
   Hero terminal — types out a realistic regression run, once, on load
   ------------------------------------------------------------------------- */
const consoleBody = document.getElementById('consoleBody');

const consoleLines = [
  { text: '$ mvn test -Dsuite=regression', cls: '' },
  { text: 'Scanning feature files… 6 loaded', cls: 'dim' },
  { text: 'Running: TradeSettlement.feature', cls: '' },
  { text: '  ✓ Validate trade booking workflow', cls: 'ok' },
  { text: '  ✓ Validate settlement instructions', cls: 'ok' },
  { text: 'Running: RetailBankingRegression.feature', cls: '' },
  { text: '  ✓ Savings account transfer', cls: 'ok' },
  { text: '  ✓ Credit card statement generation', cls: 'ok' },
  { text: '', cls: '' },
  { text: 'Tests run: 48, Failures: 0, Skipped: 0', cls: 'dim' },
  { text: 'BUILD SUCCESS', cls: 'ok' },
];

function typeConsole() {
  if (!consoleBody || document.body.dataset.consoleTyped) return;
  document.body.dataset.consoleTyped = 'true';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    consoleBody.innerHTML = consoleLines
      .map(l => l.cls ? `<span class="${l.cls}">${l.text}</span>` : l.text)
      .join('\n');
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let rendered = '';

  function typeChar() {
    if (lineIndex >= consoleLines.length) {
      consoleBody.innerHTML = rendered;
      const cursor = document.createElement('span');
      cursor.className = 'console-cursor';
      consoleBody.appendChild(cursor);
      return;
    }
    const line = consoleLines[lineIndex];
    if (charIndex === 0 && lineIndex > 0) rendered += '\n';

    if (charIndex < line.text.length) {
      charIndex++;
      const partial = line.text.slice(0, charIndex);
      const preview = rendered + (line.cls ? `<span class="${line.cls}">${partial}</span>` : partial);
      consoleBody.innerHTML = preview;
      setTimeout(typeChar, line.text.startsWith('$') ? 26 : 10);
    } else {
      rendered += (line.cls ? `<span class="${line.cls}">${line.text}</span>` : line.text);
      lineIndex++;
      charIndex = 0;
      setTimeout(typeChar, line.text === '' ? 60 : 90);
    }
  }
  typeChar();
}

const heroConsole = document.querySelector('.hero-console');
if (heroConsole) {
  const consoleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeConsole();
        consoleObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  consoleObserver.observe(heroConsole);
}

/* -------------------------------------------------------------------------
   Contact form — submits silently in-page via EmailJS (no page reload,
   no email client required). Needs three values from your EmailJS
   dashboard (https://dashboard.emailjs.com):

   1. SERVICE ID    — already set below (service_18y0t3q).
   2. TEMPLATE ID   — Email Templates → your template → copy its ID,
                       paste it into EMAILJS_TEMPLATE_ID below.
   3. PUBLIC KEY    — Account → General → "Public Key",
                       paste it into EMAILJS_PUBLIC_KEY below.

   The form's field names (name="name", name="email", name="message")
   need to match the variables used in your EmailJS template — e.g. a
   template written with {{name}}, {{email}}, {{message}} will work
   with this form exactly as-is.

   Until TEMPLATE ID and PUBLIC KEY are filled in, the form will tell
   visitors it isn't connected yet instead of failing silently.
   ------------------------------------------------------------------------- */
const EMAILJS_SERVICE_ID = 'service_18y0t3q';
const EMAILJS_TEMPLATE_ID = 'template_x2iqktb'; // e.g. 'template_abc1234'
const EMAILJS_PUBLIC_KEY = 'mZLNo6tCAA_Fc8K_N';  // e.g. 'AbCdEfGhIjKlMnOpQ'

if (window.emailjs && EMAILJS_PUBLIC_KEY) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const formSubmitBtn = contactForm ? contactForm.querySelector('.form-submit') : null;

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      formNote.textContent = 'This form isn\u2019t connected to an inbox yet — add an EmailJS template ID and public key in script.js (see README.md).';
      formNote.style.color = 'var(--text-secondary)';
      return;
    }

    formSubmitBtn.disabled = true;
    formSubmitBtn.textContent = 'Sending…';
    formNote.textContent = '';

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm);
      formNote.textContent = 'Message sent — thanks for reaching out, I\u2019ll reply soon.';
      formNote.style.color = 'var(--signal)';
      contactForm.reset();
    } catch (err) {
      formNote.textContent = 'Something went wrong sending that — please try again or email me directly.';
      formNote.style.color = 'var(--text-secondary)';
    } finally {
      formSubmitBtn.disabled = false;
      formSubmitBtn.textContent = 'Send Message';
    }
  });
}
