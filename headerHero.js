(() => {
  const header = document.querySelector('[data-hero-header]');
  const brand = document.querySelector('.hero-brand');
  const brandName = brand.querySelector('.name');
  const intro = document.querySelector('[data-hero-fade]');
  const bio = document.querySelector('.hero-bio');
  const actions = document.querySelector('.hero-actions');
  const filterContainer = document.querySelector('.filter-container');
  const firstProject = document.querySelector('.projects .projectcontainer');
  const footer = document.querySelector('footer');
  const footerSubtitle = footer.querySelector('h4');
  const root = document.documentElement;

  if (!header || !brand || !brandName || !intro || !bio || !actions || !filterContainer || !firstProject || !footer || !footerSubtitle) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const mix = (start, end, progress) => start + (end - start) * progress;
  const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

  let metrics = {};
  let ticking = false;
  function cssLengthToPx(value) {
    const number = parseFloat(value) || 0;
    if (value.includes('rem')) {
      return number * (parseFloat(getComputedStyle(root).fontSize) || 16);
    }
    return number;
  }

  function readMetrics() {
    const styles = getComputedStyle(root);
    const padding = cssLengthToPx(styles.getPropertyValue('--padding')) || 20;
    const stroke = cssLengthToPx(styles.getPropertyValue('--stroke')) || 2;
    const copyGap = cssLengthToPx(styles.getPropertyValue('--hero-copy-gap')) || (padding * 0.35);
    const footerHeight = footer.getBoundingClientRect().height || 0;
    const footerSubtitleTop = footerSubtitle.getBoundingClientRect().top || 0;
    const footerTop = footer.getBoundingClientRect().top || 0;
    const footerIsWrapped = (footerSubtitleTop - footerTop) > (padding * 1.5);
    const baseFooterReserve = padding * 2;
    const baseFooterHeight = (padding * 2) + stroke;
    const extraWrappedHeight = Math.max(0, footerHeight - baseFooterHeight);
    const headerHeight = header.offsetHeight;
    const compactHeight = padding * 4;
    const viewportWidth = window.innerWidth;
    const isNarrow = viewportWidth < 760;
    const blockGap = isNarrow ? padding : clamp(viewportWidth * 0.05, padding * 2.2, padding * 4.35);
    const minBlockX = isNarrow ? padding : padding * 1.5;
    const maxContentWidth = isNarrow
      ? clamp(viewportWidth * 0.5, 170, viewportWidth - (minBlockX * 2) - blockGap)
      : clamp(viewportWidth * 0.59, 560, 1080);

    root.style.setProperty('--hero-block-x', `${minBlockX.toFixed(2)}px`);
    root.style.setProperty('--hero-content-width', `${maxContentWidth.toFixed(2)}px`);
    void brandName.offsetWidth;

    const brandRect = brandName.getBoundingClientRect();
    const brandTextWidth = brandRect.width;
    const brandTextHeight = brandRect.height;
    const contentWidth = Math.min(maxContentWidth, brandTextWidth);
    root.style.setProperty('--hero-content-width', `${contentWidth.toFixed(2)}px`);
    root.style.setProperty('--hero-brand-height', `${brandTextHeight.toFixed(2)}px`);
    void actions.offsetHeight;

    const bioHeight = bio.getBoundingClientRect().height;
    const actionsRect = actions.getBoundingClientRect();
    const actionsHeight = actionsRect.height;
    const actionsMarginTop = cssLengthToPx(getComputedStyle(actions).marginTop) || 0;
    const stackHeight = brandTextHeight + copyGap + bioHeight + actionsMarginTop + actionsHeight;
    const availableImageWidth = Math.max(120, viewportWidth - (minBlockX * 2) - blockGap - contentWidth);
    const maxImageSize = Math.max(padding * 7, Math.min(availableImageWidth, headerHeight - (padding * 1.5)));
    const imageSize = Math.min(Math.max(stackHeight, padding * 7), maxImageSize);
    const unitHeight = Math.max(stackHeight, imageSize);
    const unitWidth = imageSize + blockGap + contentWidth;
    const blockX = clamp((viewportWidth - unitWidth) / 2, minBlockX, Math.max(minBlockX, viewportWidth - unitWidth - minBlockX));
    const blockY = clamp(
      (headerHeight - unitHeight) / 2,
      padding * 0.75,
      Math.max(padding * 0.75, headerHeight - unitHeight - (padding * 0.75))
    );

    root.style.setProperty('--hero-block-x', `${blockX.toFixed(2)}px`);
    root.style.setProperty('--hero-block-y', `${blockY.toFixed(2)}px`);
    root.style.setProperty('--hero-image-size', `${imageSize.toFixed(2)}px`);
    root.style.setProperty(
      '--footer-reserved-space',
      footerIsWrapped
        ? `${(baseFooterReserve + extraWrappedHeight).toFixed(2)}px`
        : `${baseFooterReserve.toFixed(2)}px`
    );

    const collapseTriggerY = Math.min(
      headerHeight,
      blockY + unitHeight + padding
    );
    const compactStickyOffset = compactHeight;
    const triggerStickyOffset = clamp(
      brandTextHeight + (padding * 2),
      0,
      compactStickyOffset
    );

    const startScale = 1;
    const endScale = 1;
    const startX = blockX + imageSize + blockGap - (padding * 0.2);
    const startY = blockY;
    const collapseDistance = Math.max(150, ((headerHeight - compactHeight) * 0.42) + padding);
    const compactHoldDistance = Math.max(
      padding * 4.8,
      (compactStickyOffset - triggerStickyOffset) * 2.7
    );
    const contentFadeDistance = Math.max(132, compactHeight * 1.2);
    const exitDistance = Math.max(padding * 2.5, compactHeight * 0.72);

    metrics = {
      padding,
      stroke,
      compactHeight,
      collapseStartScroll: Math.max(0, headerHeight - collapseTriggerY),
      startX,
      startY,
      startWordmarkY: 0,
      endX: padding,
      endY: padding,
      endWordmarkY: 0,
      introTravel: Math.max(compactHeight * 1.5, imageSize * 0.72),
      startScale,
      endScale,
      collapseDistance,
      compactHoldDistance,
      compactStickyOffset,
      triggerStickyOffset,
      contentFadeDistance,
      exitDistance,
      footerShowDelay: 0,
      footerShowDistance: Math.max(18, padding * 1.1),
    };

    update();
  }

  function update() {
    ticking = false;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const effectiveScroll = Math.max(0, scrollY - metrics.collapseStartScroll);
    const collapseProgress = clamp(effectiveScroll / metrics.collapseDistance, 0, 1);
    const progress = easeOutCubic(collapseProgress);
    const postCollapseScroll = Math.max(0, effectiveScroll - metrics.collapseDistance);
    const holdProgress = clamp(postCollapseScroll / metrics.compactHoldDistance, 0, 1);
    const holdEase = easeOutCubic(holdProgress);
    const exitScroll = Math.max(0, postCollapseScroll - metrics.compactHoldDistance);
    const exitProgress = clamp(exitScroll / metrics.exitDistance, 0, 1);
    const headerLiftProgress = exitProgress;
    const contentFadeProgress = clamp((exitProgress - 0.96) / 0.04, 0, 1);
    const footerProgress = exitProgress;
    const fade = clamp(1 - collapseProgress * 2.25, 0, 1);
    const visibleHeaderHeight = metrics.compactHeight * (1 - headerLiftProgress);
    const holdStickyOffset = mix(metrics.compactStickyOffset, metrics.triggerStickyOffset, holdEase);
    const exitStickyOffset = mix(metrics.triggerStickyOffset, 0, exitProgress);
    const stickyOffset = exitProgress > 0 ? exitStickyOffset : holdStickyOffset;
    const maskHeight = exitProgress > 0
      ? Math.max(0, stickyOffset + metrics.stroke)
      : metrics.compactHeight;

    root.style.setProperty('--hero-progress', progress.toFixed(4));
    root.style.setProperty('--hero-exit', exitProgress.toFixed(4));
    root.style.setProperty('--hero-brand-x', `${mix(metrics.startX, metrics.endX, progress).toFixed(2)}px`);
    root.style.setProperty('--hero-brand-y', `${mix(metrics.startY, metrics.endY, progress).toFixed(2)}px`);
    root.style.setProperty('--hero-wordmark-y', `${mix(metrics.startWordmarkY, metrics.endWordmarkY, progress).toFixed(2)}px`);
    root.style.setProperty('--hero-brand-scale', mix(metrics.startScale, metrics.endScale, progress).toFixed(4));
    root.style.setProperty('--hero-brand-opacity', (1 - contentFadeProgress).toFixed(4));
    root.style.setProperty('--hero-fade', fade.toFixed(4));
    root.style.setProperty('--hero-intro-y', `${mix(0, -metrics.introTravel, progress).toFixed(2)}px`);
    root.style.setProperty('--hero-header-y', `${(-headerLiftProgress * metrics.compactHeight).toFixed(2)}px`);
    root.style.setProperty('--hero-cd-opacity', (1 - contentFadeProgress).toFixed(4));
    root.style.setProperty('--hero-cd-y', `${(-24 * contentFadeProgress).toFixed(2)}px`);
    root.style.setProperty('--hero-mask-height', `${maskHeight.toFixed(2)}px`);
    root.style.setProperty('--sticky-tag-offset', `${stickyOffset.toFixed(2)}px`);
    root.style.setProperty('--footer-opacity', footerProgress.toFixed(4));
    root.style.setProperty('--footer-y', `${mix(100, 0, easeOutCubic(footerProgress)).toFixed(2)}%`);
    root.style.setProperty('--footer-pointer-events', footerProgress > 0.98 ? 'auto' : 'none');
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', readMetrics);
  window.addEventListener('load', readMetrics);
  readMetrics();
})();
