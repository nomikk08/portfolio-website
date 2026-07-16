// ============ Scroll progress bar ============
const progress = document.getElementById('scrollProgress');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progress.style.width = scrolled + '%';
  document.getElementById('nav').classList.toggle('scrolled', h.scrollTop > 10);
}
document.addEventListener('scroll', updateProgress, {passive:true});
updateProgress();

// ============ Mobile menu ============
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('#mobileMenu a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ============ Reveal on scroll ============
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el => revealObserver.observe(el));

// ============ Typewriter ============
const roles = [
  'Building Scalable Web Applications',
  'Django + DRF · React + Next.js',
  'Multi-Tenant SaaS Architecture',
  'Web3 & AI-Integrated Platforms'
];
const twEl = document.getElementById('typewriter');
let twRole = 0, twChar = 0, twDeleting = false;
function typeLoop(){
  const current = roles[twRole];
  if (!twDeleting){
    twChar++;
    if (twChar > current.length){ twDeleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    twChar--;
    if (twChar < 0){ twDeleting = false; twRole = (twRole+1) % roles.length; twChar = 0; }
  }
  twEl.textContent = current.slice(0, twChar);
  setTimeout(typeLoop, twDeleting ? 28 : 55);
}
typeLoop();

// ============ Count-up stats ============
const counters = document.querySelectorAll('.num[data-count]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let cur = 0;
      const step = Math.max(1, Math.ceil(target/40));
      const iv = setInterval(() => {
        cur += step;
        if (cur >= target){ cur = target; clearInterval(iv); }
        el.textContent = cur + suffix;
      }, 30);
      countObserver.unobserve(el);
    }
  });
}, {threshold:0.5});
counters.forEach(el => countObserver.observe(el));

// ============ Timeline fill on scroll ============
const timeline = document.querySelector('.timeline');
const timelineLine = document.getElementById('timelineLine');
function updateTimelineFill(){
  if (!timeline) return;
  const rect = timeline.getBoundingClientRect();
  const vh = window.innerHeight;
  const total = rect.height;
  const visible = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
  const pct = total > 0 ? (visible/total)*100 : 0;
  timelineLine.style.setProperty('--fill', pct + '%');
}
document.addEventListener('scroll', updateTimelineFill, {passive:true});
updateTimelineFill();

// ============ Active nav link on scroll ============
const sections = ['work','stack','services','about','contact'].map(id => document.getElementById(id)).filter(Boolean);
const navLinks = document.querySelectorAll('[data-nav]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      navLinks.forEach(l => l.style.color = (l.getAttribute('href') === '#'+entry.target.id) ? 'var(--text)' : '');
    }
  });
}, {threshold:0.4});
sections.forEach(s => sectionObserver.observe(s));

// ============ Contact form via Formspree ============
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  statusEl.textContent = '';
  try{
    const res = await fetch(form.action, {
      method:'POST',
      body:new FormData(form),
      headers:{'Accept':'application/json'}
    });
    if (res.ok){
      statusEl.textContent = '✓ Message sent — I\'ll get back to you soon.';
      statusEl.style.color = 'var(--cyan)';
      form.reset();
    } else {
      statusEl.textContent = 'Something went wrong — please email me directly at nomikk08@gmail.com';
      statusEl.style.color = '#ff8a8a';
    }
  } catch(err){
    statusEl.textContent = 'Network error — please email me directly at nomikk08@gmail.com';
    statusEl.style.color = '#ff8a8a';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
  }
});
