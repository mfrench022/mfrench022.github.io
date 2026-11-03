// Turns mailto: links into copy-to-clipboard triggers with a confirmation toast.
(() => {
  const TRIGGER = '[data-copy-email]';
  let toast = null;
  let hideTimer = null;

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    // Fallback for non-secure contexts (e.g. local file previews)
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  function showToast() {
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'copy-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'email copied';
      document.body.appendChild(toast);
    }

    toast.classList.add('is-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove('is-visible'), 1600);
  }

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    const email = link.getAttribute('href').replace(/^mailto:/i, '').split('?')[0];
    if (!email) return;

    const button = link.closest('button');
    const trigger = button || link;
    trigger.dataset.copyEmail = email;
    trigger.setAttribute('aria-label', 'Copy email address');

    if (button) {
      button.type = 'button';
    } else {
      link.setAttribute('role', 'button');
      link.tabIndex = 0;
    }

    link.removeAttribute('href');
  });

  async function handleTrigger(event) {
    if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;

    const trigger = event.target.closest(TRIGGER);
    if (!trigger) return;

    event.preventDefault();

    try {
      await copyText(trigger.dataset.copyEmail);
      showToast();
    } catch (error) {
      console.error('Failed to copy email address.', error);
    }
  }

  document.addEventListener('click', handleTrigger);
  document.addEventListener('keydown', handleTrigger);
})();
