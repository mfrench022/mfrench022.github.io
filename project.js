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
        .clickable
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


    // --------ZOOM IN ON IMAGE-------

   const projectContainers = document.querySelectorAll('.projectcontainer2');

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
    // Prevent reopening if already zoomed
    if (this.classList.contains('zoomed')) return;

    // Close any open zoomed container
    document.querySelectorAll('.projectcontainer2.zoomed').forEach(open => {
      open.classList.remove('zoomed');
      const btn = open.querySelector('.close-btn');
      if (btn) btn.remove();
    });

    // Add zoomed state
    this.classList.add('zoomed');

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '×';
    this.appendChild(closeBtn);

    // Close on click of the button
    closeBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      this.classList.remove('zoomed');
      closeBtn.remove();
    });
  }

  // ---- Enable/disable based on viewport ----
  function checkViewport() {
    if (window.innerWidth >= 1031) {
      enableZoom();
    } else {
      disableZoom();
      // Also ensure nothing stays zoomed
      document.querySelectorAll('.projectcontainer2.zoomed').forEach(open => {
        open.classList.remove('zoomed');
        const btn = open.querySelector('.close-btn');
        if (btn) btn.remove();
      });
    }
  }

  // Run on load and on resize
  window.addEventListener('load', checkViewport);
  window.addEventListener('resize', checkViewport);