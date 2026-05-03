(() => {
  const toastId = 'email-copy-toast';
  const copyTriggerSelector = '[data-copy-email]';
  let hideTimer = null;

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    document.execCommand('copy');
    textarea.remove();
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    fallbackCopy(text);
  }

  function getToast() {
    let toast = document.getElementById(toastId);

    if (!toast) {
      toast = document.createElement('div');
      toast.id = toastId;
      toast.className = 'copy-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = 'email copied';
      toast.style.position = 'fixed';
      toast.style.left = '50%';
      toast.style.top = '56%';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.style.justifyContent = 'center';
      toast.style.textAlign = 'center';
      toast.style.transform = 'translate(-50%, -50%) scale(0.96)';
      toast.style.minHeight = '3.2rem';
      toast.style.padding = '0.7rem 1.4rem';
      toast.style.border = '0.15rem solid #242424';
      toast.style.borderRadius = '0.7rem';
      toast.style.background = 'rgba(217, 217, 217, 0.98)';
      toast.style.color = '#242424';
      toast.style.fontFamily = 'Aldrich, sans-serif';
      toast.style.fontSize = '0.8rem';
      toast.style.lineHeight = '1';
      toast.style.letterSpacing = '0.02em';
      toast.style.textTransform = 'uppercase';
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
      toast.style.transition = 'opacity 200ms ease, transform 200ms ease';
      toast.style.zIndex = '99999';
      toast.style.boxShadow = '0 0.6rem 1.5rem rgba(36, 36, 36, 0.16)';
      document.body.appendChild(toast);
    }

    return toast;
  }

  function showToast() {
    const toast = getToast();
    toast.classList.add('is-visible');
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, -50%) scale(1)';

    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      toast.classList.remove('is-visible');
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -50%) scale(0.96)';
    }, 1600);
  }

  function prepareCopyTriggers() {
    const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');

    mailtoLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const email = href.replace(/^mailto:/i, '').split('?')[0];

      if (!email) return;

      const button = link.closest('button');

      if (button) {
        button.dataset.copyEmail = email;
        button.type = 'button';
        button.setAttribute('aria-label', 'Copy email address');
      } else {
        link.dataset.copyEmail = email;
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        link.setAttribute('aria-label', 'Copy email address');
      }

      link.removeAttribute('href');
    });
  }

  function getCopyEmail(trigger) {
    if (!trigger) return '';

    const directEmail = trigger.dataset.copyEmail;
    if (directEmail) return directEmail;

    const nestedTrigger = trigger.querySelector(copyTriggerSelector);
    return nestedTrigger ? nestedTrigger.dataset.copyEmail || '' : '';
  }

  prepareCopyTriggers();

  document.addEventListener('click', async (event) => {
    const copyTrigger = event.target.closest(copyTriggerSelector);

    if (!copyTrigger) return;

    event.preventDefault();

    const email = getCopyEmail(copyTrigger);

    if (!email) return;

    try {
      await copyText(email);
      showToast();
    } catch (error) {
      console.error('Failed to copy email address.', error);
    }
  });

  document.addEventListener('keydown', async (event) => {
    const copyTrigger = event.target.closest(copyTriggerSelector);

    if (!copyTrigger) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();

    const email = getCopyEmail(copyTrigger);

    if (!email) return;

    try {
      await copyText(email);
      showToast();
    } catch (error) {
      console.error('Failed to copy email address.', error);
    }
  });
})();
