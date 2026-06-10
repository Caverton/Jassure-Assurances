/* ── Année dynamique dans le footer ─────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Navbar : effet scroll ───────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Menu burger (mobile) ────────────────────────────────── */
const burgerBtn  = document.getElementById('burger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const burgerIcon = document.getElementById('burger-icon');
const closeIcon  = document.getElementById('close-icon');

burgerBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burgerIcon.classList.toggle('hidden', isOpen);
  closeIcon.classList.toggle('hidden', !isOpen);
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burgerIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  });
});

/* ── Smooth scroll pour les ancres ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  });
});

/* ── Onglets Particuliers / Professionnels ───────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.add('hidden'));
    const tabId = 'tab-' + btn.dataset.tab;
    document.getElementById(tabId).classList.remove('hidden');
  });
});

/* ── Envoi du formulaire via Formspree ───────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('[type="submit"]');
    const errorBox = document.getElementById('form-error');
    const successBox = document.getElementById('form-success');

    errorBox.classList.add('hidden');
    successBox.classList.add('hidden');

    const prenom = document.getElementById('prenom').value.trim();
    const nom    = document.getElementById('nom').value.trim();
    const email  = document.getElementById('email').value.trim();
    const tel    = document.getElementById('telephone').value.trim();

    if (!prenom || !nom || !email || !tel) {
      errorBox.querySelector('span').innerText = 'Veuillez remplir tous les champs obligatoires (*).';
      errorBox.classList.remove('hidden');
      return;
    }

    btn.disabled = true;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Envoi en cours...</span>';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        successBox.classList.remove('hidden');
        setTimeout(() => successBox.classList.add('hidden'), 6000);
      } else {
        const data = await response.json();
        errorBox.querySelector('span').innerText = data.errors
          ? data.errors.map(e => e.message).join(', ')
          : 'Une erreur est survenue.';
        errorBox.classList.remove('hidden');
      }
    } catch (err) {
      errorBox.querySelector('span').innerText = 'Impossible de joindre le serveur. Veuillez réessayer.';
      errorBox.classList.remove('hidden');
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  });
});

/* ── Animations d'apparition au scroll ──────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
