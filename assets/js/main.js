const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth in-page navigation.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  });
});

// Hero sparkle field.
const hero = document.querySelector('.hero-home');
if (hero) {
  const field = document.createElement('div');
  field.className = 'sparkle-field';
  field.setAttribute('aria-hidden', 'true');

  const sparkleCount = window.innerWidth < 760 ? 12 : 22;
  for (let i = 0; i < sparkleCount; i += 1) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${4 + Math.random() * 92}%`;
    sparkle.style.top = `${7 + Math.random() * 82}%`;
    sparkle.style.setProperty('--size', `${4 + Math.random() * 9}px`);
    sparkle.style.setProperty('--duration', `${4.3 + Math.random() * 5.5}s`);
    sparkle.style.setProperty('--delay', `${-Math.random() * 6}s`);
    field.appendChild(sparkle);
  }
  hero.prepend(field);

  if (!reducedMotion) {
    hero.addEventListener('pointermove', event => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--hero-x', `${x}%`);
      hero.style.setProperty('--hero-y', `${y}%`);

      const name = hero.querySelector('.hero-name');
      if (name) {
        const dx = (x - 50) * 0.025;
        const dy = (y - 50) * 0.018;
        name.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    });

    hero.addEventListener('pointerleave', () => {
      const name = hero.querySelector('.hero-name');
      if (name) name.style.transform = '';
      hero.style.setProperty('--hero-x', '50%');
      hero.style.setProperty('--hero-y', '45%');
    });
  }
}

// Soft mouse-follow aura across the page.
if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  glow.className = 'pointer-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);

  let frame;
  document.addEventListener('pointermove', event => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      document.body.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.body.style.setProperty('--pointer-y', `${event.clientY}px`);
    });
  });
}

// Scroll reveal. Cards receive tiny staggered delays so grids feel alive.
const revealTargets = [
  ...document.querySelectorAll('.section-heading'),
  ...document.querySelectorAll('.profile-card, .project-card, .art-tile, .motion-card, .experience-card, .skill-card, .contact-panel, .gallery-card, .process-stage, .document-panel, .missing-work')
];

revealTargets.forEach((element, index) => {
  element.classList.add('reveal');
  element.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 55, 275)}ms`);
});

if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

  revealTargets.forEach(element => revealObserver.observe(element));
} else {
  revealTargets.forEach(element => element.classList.add('is-visible'));
}

// Subtle 3D tilt for cards on precise-pointer devices.
if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  const tiltTargets = document.querySelectorAll('.profile-card, .project-card, .art-tile, .motion-card, .experience-card, .skill-card, .gallery-card');

  tiltTargets.forEach(card => {
    card.classList.add('tilt-card');

    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 4.2;
      const rotateX = (0.5 - py) * 4.2;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

// Highlight the navigation item for the section currently in view.
const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
const navSections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && navSections.length) {
  const navObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const activeId = `#${visible.target.id}`;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === activeId);
    });
  }, { threshold: [0.2, 0.45, 0.7], rootMargin: '-18% 0px -55% 0px' });

  navSections.forEach(section => navObserver.observe(section));
}
