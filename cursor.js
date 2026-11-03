// Custom cursor: follows the pointer and swaps image for base / hover / pressed states.
(() => {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;

  const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, .clickable';
  const isInteractive = (el) => !!el?.closest(INTERACTIVE);
  let hoverTarget = null;

  const setState = (state) => {
    cursor.classList.remove('is-base', 'is-hover', 'is-down');
    cursor.classList.add(`is-${state}`);
  };
  const setRestingState = () => setState(isInteractive(hoverTarget) ? 'hover' : 'base');
  const isPressed = () => cursor.classList.contains('is-down');

  document.addEventListener('mousemove', (e) => {
    cursor.style.opacity = 1;
    cursor.style.transform =
      `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(var(--s, 1))`;
  });
  document.documentElement.addEventListener('mouseleave', () => { cursor.style.opacity = 0; });

  document.addEventListener('mousedown', () => setState('down'));
  document.addEventListener('mouseup', setRestingState);

  document.addEventListener('pointerover', (e) => {
    hoverTarget = e.target;
    if (!isPressed()) setRestingState();
  });
  document.addEventListener('pointerout', (e) => {
    hoverTarget = e.relatedTarget;
    if (!isPressed()) setRestingState();
  });

  setState('base');
})();
