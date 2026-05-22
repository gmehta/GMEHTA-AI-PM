/* ─── Nav scroll behavior ─────────────────────────────────────────────────── */
const nav = document.getElementById('nav');

const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
};

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ─── Mobile menu toggle ──────────────────────────────────────────────────── */
const toggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('nav-mobile');

toggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  toggle.classList.toggle('open', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

/* ─── Scroll-reveal (Intersection Observer) ───────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Active nav link highlight ───────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--text)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(section => sectionObserver.observe(section));

/* ─── Footer year ─────────────────────────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── Smooth scroll for all anchor links ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h'), 10) || 64;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
