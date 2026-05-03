    // -------- Custom Cursor --------
    (() => {
      const cursor = document.querySelector('.custom-cursor.site-wide');
      if (!cursor) return;

      const setPos = (e) => {
        cursor.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(var(--s,1))`;
      };

      let shown = false;
      document.addEventListener('mouseenter', () => { cursor.style.opacity = 1; shown = true; });
      document.addEventListener('mouseleave', () => { cursor.style.opacity = 0; shown = false; });

      document.addEventListener('mousemove', (e) => {
        if (!shown) cursor.style.opacity = 1;
        setPos(e);
      });

      document.addEventListener('mousedown', () => {
        cursor.classList.remove('is-base', 'is-hover');
        cursor.classList.add('is-down');
      });
      document.addEventListener('mouseup', () => {
        cursor.classList.remove('is-down');
        cursor.classList.add(isInteractive(lastHoverTarget) ? 'is-hover' : 'is-base');
      });

      const INTERACTIVE_SELECTOR = `
        a, button, [role="button"], [data-tag],
        input, select, textarea, label,
        .clickable,
        .imagecontainer2
      `;

      let lastHoverTarget = null;
      const isInteractive = (el) => !!(el && el.closest(INTERACTIVE_SELECTOR));

      document.addEventListener('pointerover', (e) => {
        lastHoverTarget = e.target;
        if (isInteractive(e.target) && !cursor.classList.contains('is-down')) {
          cursor.classList.remove('is-base');
          cursor.classList.add('is-hover');
        }
      });

      document.addEventListener('pointerout', (e) => {
        if (!cursor.classList.contains('is-down')) {
          const stillOnInteractive = isInteractive(e.relatedTarget);
          cursor.classList.toggle('is-hover', !!stillOnInteractive);
          cursor.classList.toggle('is-base', !stillOnInteractive);
        }
        lastHoverTarget = e.relatedTarget;
      });

      cursor.classList.add('is-base');
    })();

    // -------- Fixed footer spacing on project pages -------
    (() => {
      const footer = document.querySelector('footer');
      const footerSubtitle = footer?.querySelector('h4');
      if (!footer || !footerSubtitle) return;

      const root = document.documentElement;
      const cssLengthToPx = (value) => {
        const number = parseFloat(value) || 0;
        if (value.includes('rem')) {
          return number * (parseFloat(getComputedStyle(root).fontSize) || 16);
        }
        return number;
      };

      const updateFooterReserve = () => {
        const rootStyles = getComputedStyle(root);
        const padding = cssLengthToPx(rootStyles.getPropertyValue('--padding')) || 20;
        const stroke = cssLengthToPx(rootStyles.getPropertyValue('--stroke')) || 2;
        const footerTop = footer.getBoundingClientRect().top || 0;
        const subtitleTop = footerSubtitle.getBoundingClientRect().top || 0;
        const footerIsWrapped = (subtitleTop - footerTop) > (padding * 1.5);
        const baseReserve = padding * 3;
        const baseFooterHeight = (padding * 2) + stroke;
        const extraWrappedHeight = Math.max(0, footer.getBoundingClientRect().height - baseFooterHeight);

        root.style.setProperty(
          '--project-footer-reserved-space',
          footerIsWrapped
            ? `${(baseReserve + extraWrappedHeight).toFixed(2)}px`
            : `${baseReserve.toFixed(2)}px`
        );
      };

      window.addEventListener('load', updateFooterReserve);
      window.addEventListener('resize', updateFooterReserve);
      updateFooterReserve();
    })();


    // --------ZOOM IN ON IMAGE-------

   const projectContainers = document.querySelectorAll('.projectcontainer2');

  function removeZoomControls(container) {
    container.querySelectorAll('.close-btn, .zoom-nav-btn').forEach((el) => el.remove());
  }

  function closeAllZoomed() {
    document.querySelectorAll('.projectcontainer2.zoomed').forEach((open) => {
      open.classList.remove('zoomed');
      removeZoomControls(open);
    });
  }

  function openZoomed(container) {
    closeAllZoomed();
    container.classList.add('zoomed');

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-btn');
    closeBtn.type = 'button';
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      container.classList.remove('zoomed');
      removeZoomControls(container);
    });

    const prevBtn = document.createElement('button');
    prevBtn.classList.add('zoom-nav-btn', 'zoom-prev');
    prevBtn.type = 'button';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.innerHTML = '‹';

    const nextBtn = document.createElement('button');
    nextBtn.classList.add('zoom-nav-btn', 'zoom-next');
    nextBtn.type = 'button';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.innerHTML = '›';

    const allContainers = () => Array.from(document.querySelectorAll('.projectcontainer2'));
    const navigate = (delta) => {
      const list = allContainers();
      const idx = list.indexOf(container);
      if (idx === -1) return;
      const nextIdx = (idx + delta + list.length) % list.length;
      openZoomed(list[nextIdx]);
    };

    prevBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      navigate(-1);
    });
    nextBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      navigate(1);
    });

    container.append(closeBtn, prevBtn, nextBtn);
  }

  function enableZoom() {
    projectContainers.forEach(container => {
      container.addEventListener('click', zoomHandler);
    });
  }

  function disableZoom() {
    projectContainers.forEach(container => {
      container.removeEventListener('click', zoomHandler);
    });
  }

  function zoomHandler(e) {
    if (this.classList.contains('zoomed')) return;
    openZoomed(this);
  }

  // ---- Enable/disable based on viewport ----
  function checkViewport() {
    if (window.innerWidth >= 1031) {
      enableZoom();
    } else {
      disableZoom();
      // Also ensure nothing stays zoomed
      document.querySelectorAll('.projectcontainer2.zoomed').forEach((open) => {
        open.classList.remove('zoomed');
        removeZoomControls(open);
      });
    }
  }

  // Run on load and on resize
  window.addEventListener('load', checkViewport);
  window.addEventListener('resize', checkViewport);
