const currentPage = document.body.dataset.page;
const pageLinks = document.querySelectorAll('.primary-nav a');
const pageNames = {
  literature: 'literature-review.html',
  methodology: 'methodology.html',
  findings: 'findings.html',
  conclusions: 'conclusions.html',
  bibliography: 'bibliography.html'
};

if (pageNames[currentPage]) {
  document.querySelector(`.primary-nav a[href="${pageNames[currentPage]}"]`)?.setAttribute('aria-current', 'page');
}

const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  primaryNav?.classList.toggle('is-open', !isOpen);
  menuToggle.querySelector('span').textContent = isOpen ? '+' : '\u2212';
});

document.querySelectorAll('.copyright-year').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const scrollVideos = document.querySelectorAll('[data-scroll-play]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.15 });

  scrollVideos.forEach((video) => videoObserver.observe(video));
}

const nurockPoint = document.querySelector('.nurock-feature');
const nurockImage = document.querySelector('.page-aside-image img');
const nurockCitation = document.querySelector('.nurock-citation');
const nurockOverlay = document.querySelector('.nurock-arrow-overlay');
const nurockPath = document.querySelector('.nurock-overlay-path');
const reportGrid = document.querySelector('.report-grid');

if (nurockPoint && nurockImage && nurockCitation && nurockOverlay && nurockPath && reportGrid) {
  const alignRailImage = () => {
    const gridTop = reportGrid.getBoundingClientRect().top + window.scrollY;
    const citationTop = nurockCitation.getBoundingClientRect().top + window.scrollY;
    document.querySelector('.page-aside-image').style.setProperty('--nurock-image-top', `${citationTop - gridTop}px`);
  };

  const updateNurockArrow = () => {
    const gridBounds = reportGrid.getBoundingClientRect();
    const citationBounds = nurockCitation.getBoundingClientRect();
    const imageBounds = nurockImage.getBoundingClientRect();
    const startX = citationBounds.left - gridBounds.left;
    const startY = citationBounds.top + citationBounds.height / 2 - gridBounds.top;
    const endX = imageBounds.right - gridBounds.left;
    const endY = imageBounds.top + imageBounds.height * 0.72 - gridBounds.top;
    const curve = Math.max(48, (startX - endX) * 0.28);

    nurockOverlay.setAttribute('viewBox', `0 0 ${gridBounds.width} ${reportGrid.offsetHeight}`);
    nurockPath.setAttribute('d', `M ${startX} ${startY} C ${startX - curve} ${startY}, ${endX + curve} ${endY}, ${endX} ${endY}`);
  };

  alignRailImage();
  nurockImage.addEventListener('load', alignRailImage, { once: true });
  document.fonts?.ready.then(alignRailImage);
  if ('ResizeObserver' in window) {
    const layoutObserver = new ResizeObserver(alignRailImage);
    layoutObserver.observe(nurockCitation);
    layoutObserver.observe(reportGrid);
  }
  window.addEventListener('resize', () => {
    alignRailImage();
    if (nurockOverlay.classList.contains('is-drawing')) updateNurockArrow();
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const arrowObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          alignRailImage();
          updateNurockArrow();
          nurockOverlay.classList.add('is-drawing');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    arrowObserver.observe(nurockPoint);
  }
}