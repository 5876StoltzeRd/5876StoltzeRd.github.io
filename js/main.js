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

// Keep image references stable while allowing local preview before final photo curation.
document.querySelectorAll('img[data-fallback]').forEach((img) => {
  img.addEventListener('error', () => {
    img.src = img.dataset.fallback;
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

const viewer = document.querySelector('#gallery-lightbox');
const viewerImage = document.querySelector('#lightbox-image');
const viewerCaption = document.querySelector('#lightbox-caption');
const viewerClose = document.querySelector('.lightbox-close');
const viewerPrev = document.querySelector('.lightbox-prev');
const viewerNext = document.querySelector('.lightbox-next');

const galleryImages = Array.from(document.querySelectorAll('.gallery img, .chapter-grid img, .tile img'));
let currentImageIndex = -1;

function setViewerImage(index) {
  const image = galleryImages[index];
  if (!image || !viewerImage || !viewerCaption) {
    return;
  }

  viewerImage.src = image.currentSrc || image.src;
  viewerImage.alt = image.alt;
  viewerCaption.textContent = image.alt || 'Property image';
  currentImageIndex = index;
}

function openViewer(index) {
  if (!viewer) {
    return;
  }

  setViewerImage(index);
  viewer.classList.add('open');
  viewer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeViewer() {
  if (!viewer) {
    return;
  }

  viewer.classList.remove('open');
  viewer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function stepViewer(delta) {
  if (!galleryImages.length) {
    return;
  }

  const nextIndex = (currentImageIndex + delta + galleryImages.length) % galleryImages.length;
  setViewerImage(nextIndex);
}

galleryImages.forEach((image, index) => {
  image.addEventListener('click', () => openViewer(index));

  image.addEventListener('mousemove', (event) => {
    const rect = image.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    image.style.transform = `scale(1.04) rotateX(${-y * 4}deg) rotateY(${x * 5}deg)`;
  });

  image.addEventListener('mouseleave', () => {
    image.style.transform = '';
  });
});

if (viewerClose) {
  viewerClose.addEventListener('click', closeViewer);
}

if (viewerPrev) {
  viewerPrev.addEventListener('click', () => stepViewer(-1));
}

if (viewerNext) {
  viewerNext.addEventListener('click', () => stepViewer(1));
}

if (viewer) {
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) {
      closeViewer();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (!viewer || !viewer.classList.contains('open')) {
    return;
  }

  if (event.key === 'Escape') {
    closeViewer();
  }

  if (event.key === 'ArrowRight') {
    stepViewer(1);
  }

  if (event.key === 'ArrowLeft') {
    stepViewer(-1);
  }
});

const parallaxLayers = document.querySelectorAll('.scenic-band-media[data-parallax-speed]');

if (parallaxLayers.length) {
  const updateParallax = () => {
    const viewCenter = window.innerHeight * 0.5;

    parallaxLayers.forEach((layer) => {
      const speed = Number(layer.dataset.parallaxSpeed || 0.2);
      const parent = layer.parentElement;
      if (!parent) {
        return;
      }

      const rect = parent.getBoundingClientRect();
      const centerDelta = rect.top + rect.height * 0.5 - viewCenter;
      layer.style.transform = `translateY(${centerDelta * -speed}px)`;
    });
  };

  updateParallax();
  window.addEventListener('scroll', updateParallax, { passive: true });
  window.addEventListener('resize', updateParallax);
}
