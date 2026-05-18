const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');
const navLinks = document.querySelectorAll('#site-nav a');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('open');
    });
  });
}

// Ensure back-to-top works even when hash is already #top.
document.querySelectorAll('.back-to-top').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Fallback image support for local preview and missing assets.
document.querySelectorAll('img[data-fallback]').forEach((img) => {
  img.addEventListener('error', () => {
    if (img.dataset.fallback) {
      img.src = img.dataset.fallback;
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

// Accessible accordion behavior.
const accordionRoot = document.querySelector('[data-accordion]');
if (accordionRoot) {
  const triggers = accordionRoot.querySelectorAll('.accordion-trigger');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;

      trigger.setAttribute('aria-expanded', String(!isExpanded));
      if (panel) {
        panel.hidden = isExpanded;
      }
    });
  });
}

// Lightbox interaction for unified gallery images.
const viewer = document.querySelector('#gallery-lightbox');
const viewerImage = document.querySelector('#lightbox-image');
const viewerCaption = document.querySelector('#lightbox-caption');
const viewerClose = document.querySelector('.lightbox-close');
const viewerPrev = document.querySelector('.lightbox-prev');
const viewerNext = document.querySelector('.lightbox-next');

const clickableFigures = Array.from(document.querySelectorAll('.gallery-card'));
const clickableImages = clickableFigures
  .map((figure) => figure.querySelector('img'))
  .filter((image) => image !== null);

// On the home page, extend the lightbox with the full gallery images.
document.querySelectorAll('#lightbox-extra-images img').forEach((img) => clickableImages.push(img));

let activeImageIndex = -1;


function getImageCaption(image) {
  const figure = image.closest('figure');
  const caption = figure ? figure.querySelector('figcaption') : null;
  return (caption && caption.textContent) || image.alt || 'Property image';
}

function setLightboxImage(index) {
  const target = clickableImages[index];
  if (!target || !viewerImage || !viewerCaption) {
    return;
  }

  viewerImage.src = target.currentSrc || target.src;
  viewerImage.alt = target.alt || 'Property image';
  viewerCaption.textContent = getImageCaption(target);
  activeImageIndex = index;
}

function openLightbox(index) {
  if (!viewer) {
    return;
  }
  setLightboxImage(index);
  viewer.classList.add('open');
  viewer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!viewer) {
    return;
  }
  viewer.classList.remove('open');
  viewer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function stepLightbox(direction) {
  if (!clickableImages.length) {
    return;
  }
  const next = (activeImageIndex + direction + clickableImages.length) % clickableImages.length;
  setLightboxImage(next);
}

clickableFigures.forEach((figure, index) => {
  figure.addEventListener('click', () => openLightbox(index));
  figure.setAttribute('tabindex', '0');
  figure.setAttribute('role', 'button');
  figure.setAttribute('aria-label', 'Open photo viewer');

  figure.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

if (viewerClose) {
  viewerClose.addEventListener('click', closeLightbox);
}
if (viewerPrev) {
  viewerPrev.addEventListener('click', () => stepLightbox(-1));
}
if (viewerNext) {
  viewerNext.addEventListener('click', () => stepLightbox(1));
}
if (viewer) {
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) {
      closeLightbox();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (!viewer || !viewer.classList.contains('open')) {
    return;
  }

  if (event.key === 'Escape') {
    closeLightbox();
  }
  if (event.key === 'ArrowRight') {
    stepLightbox(1);
  }
  if (event.key === 'ArrowLeft') {
    stepLightbox(-1);
  }
});

// Timeline card expand/collapse behavior
const timelineCards = document.querySelectorAll('[data-timeline-card]');
timelineCards.forEach((card) => {
  const trigger = card.querySelector('.timeline-card-trigger');
  const content = card.querySelector('.timeline-card-content');

  if (!trigger || !content) return;

  trigger.addEventListener('click', () => {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    
    // Close other cards in the same year group
    const yearGroup = card.closest('.timeline-year-group');
    if (yearGroup) {
      yearGroup.querySelectorAll('[data-timeline-card]').forEach((otherCard) => {
        if (otherCard !== card) {
          const otherTrigger = otherCard.querySelector('.timeline-card-trigger');
          const otherContent = otherCard.querySelector('.timeline-card-content');
          if (otherTrigger && otherContent) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherContent.hidden = true;
            otherContent.style.maxHeight = '0';
            otherCard.removeAttribute('data-expanded');
          }
        }
      });
    }

    // Toggle current card
    trigger.setAttribute('aria-expanded', String(!isExpanded));
    if (!isExpanded) {
      content.hidden = false;
      card.setAttribute('data-expanded', 'true');
      // Animate height
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      content.style.maxHeight = '0';
      card.removeAttribute('data-expanded');
      setTimeout(() => {
        content.hidden = true;
      }, 300);
    }
  });
});

// Parallax-style movement for scenic strips.
const parallaxLayers = document.querySelectorAll('.scenic-band-media[data-parallax-speed]');

if (parallaxLayers.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const updateParallax = () => {
    const viewportCenter = window.innerHeight * 0.5;

    parallaxLayers.forEach((layer) => {
      const speed = Number(layer.dataset.parallaxSpeed || 0.2);
      const host = layer.parentElement;
      if (!host) {
        return;
      }

      const rect = host.getBoundingClientRect();
      const delta = rect.top + rect.height * 0.5 - viewportCenter;
      layer.style.transform = `translateY(${delta * -speed}px)`;
    });
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax);
}
