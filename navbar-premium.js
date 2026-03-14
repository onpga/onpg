(function () {
  const root = document.querySelector('[data-np-root]');
  if (!root) return;

  const nav = root.querySelector('.np-navbar');
  const mobileToggle = root.querySelector('.np-mobile-toggle');
  const navList = root.querySelector('.np-nav-list');
  const items = root.querySelectorAll('.np-item.has-dropdown');

  const closeAll = () => {
    items.forEach((item) => {
      item.classList.remove('is-open');
      const trigger = item.querySelector('.np-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  const openItem = (item) => {
    closeAll();
    item.classList.add('is-open');
    const trigger = item.querySelector('.np-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  };

  items.forEach((item) => {
    const trigger = item.querySelector('.np-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const isOpen = item.classList.contains('is-open');
      if (isOpen) {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        openItem(item);
      }
    });

    item.addEventListener('mouseenter', function () {
      if (window.matchMedia('(min-width: 981px)').matches) {
        openItem(item);
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!root.contains(e.target)) {
      closeAll();
      if (navList) navList.classList.remove('is-open');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });

  if (mobileToggle && navList) {
    mobileToggle.addEventListener('click', function () {
      const opened = navList.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
      if (!opened) closeAll();
    });
  }

  const updateProgress = () => {
    if (!nav) return;
    const top = window.scrollY || document.documentElement.scrollTop || 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, top / max)) : 0;
    nav.style.setProperty('--np-progress', `${ratio * 100}%`);
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
})();
