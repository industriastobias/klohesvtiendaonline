// Basic: sin sesión Google. Premium: sesión Google activa, sin suscripción de pago.
// El límite mensual es una condición escrita; no se registra un contador de usos.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const MINIMUM_CENTS = 2500;
  let auth = null, user = null, selected = '', lastMember = false, cartSubtotalCents = 0;
  const member = () => Boolean(user?.uid && auth?.currentUser?.uid === user.uid &&
    user.providerData?.some(provider => provider.providerId === 'google.com'));
  const cents = value => Math.max(0, Math.round((Number(value) + Number.EPSILON) * 100) || 0);
  const eligibleCart = () => member() && cartSubtotalCents > MINIMUM_CENTS;

  function updateCartSafely() {
    if (typeof window.updateCart === 'function') window.updateCart();
  }
  function render() {
    const isMember = member();
    const eligible = eligibleCart();
    const tier = isMember ? 'PREMIUM' : 'BASIC';
    $('daymarBenefit').hidden = !isMember;
    $('daymarBenefitControls').hidden = !eligible;
    $('daymarBenefitMinimumNotice').hidden = eligible;
    const choice = $('daymarBenefitSelect');
    choice.disabled = !eligible;
    choice.value = selected;
    choice.querySelector('option[value="shipping"]').disabled =
      !document.querySelector('#shippingToggle')?.classList.contains('active');
    const extraTrigger = $('cartExtraTrigger');
    extraTrigger.disabled = !eligible;
    extraTrigger.dataset.hasExtra = String(Boolean(selected));
    $('cartExtraValue').textContent = selected === 'coupon' ? '$5 en productos' : selected === 'shipping' ? 'Envío gratis' : 'Sin extra';
    const shippingAvailable = !choice.querySelector('option[value="shipping"]').disabled;
    $('cartExtraShippingHint').textContent = shippingAvailable ? 'Entrega sin costo de envío.' : 'Activa el envío en tu carrito.';
    document.querySelectorAll('#cartExtraDialog [data-extra-value]').forEach(button => {
      button.disabled = !eligible || (button.dataset.extraValue === 'shipping' && !shippingAvailable);
      button.setAttribute('aria-checked', String(button.dataset.extraValue === selected));
    });
    if (!eligible && $('cartExtraDialog').open) $('cartExtraDialog').close();
    $('daymarLoginDescription').textContent = tier;
    $('daymarLoginDescription').classList.toggle('is-premium', isMember);
    $('daymarWelcomeTier').textContent = tier;
    const previewTier = $('daymarPreviewTier');
    if (previewTier) {
      previewTier.textContent = tier;
      previewTier.classList.toggle('is-premium', isMember);
      previewTier.setAttribute('aria-label', 'Nivel de tu sesión: ' + tier);
    }
    const offers = document.querySelectorAll('#daymarWelcomeOffers strong');
    if (offers.length === 3) {
      offers[0].textContent = '40% de descuento';
      offers[1].textContent = '2% de descuento';
      offers[2].textContent = '50% de descuento';
    }
  }

  function initialize(_, firebaseAuth) { auth = firebaseAuth; }
  function setUser(value) {
    const previous = lastMember;
    user = value; selected = ''; cartSubtotalCents = 0; lastMember = member();
    render();
    if (previous !== lastMember && typeof window.refreshDaymarPrices === 'function') window.refreshDaymarPrices();
    else updateCartSafely();
  }

  function quote(subtotal, shippingCost) {
    const subtotalCents = cents(subtotal), baseShipping = cents(shippingCost);
    // La validación del importe se repite aquí: ocultar un selector no protege el cálculo.
    const eligible = member() && Boolean(selected) && subtotalCents > MINIMUM_CENTS;
    const couponCents = eligible && selected === 'coupon' ? Math.min(500, subtotalCents) : 0;
    const shippingCents = eligible && selected === 'shipping' && baseShipping > 0 ? 0 : baseShipping;
    return {
      coupon: couponCents / 100,
      shipping: shippingCents / 100,
      total: (subtotalCents - couponCents + shippingCents) / 100,
      kind: eligible && (selected === 'coupon' || baseShipping > 0) ? selected : ''
    };
  }

  $('daymarBenefitSelect').addEventListener('change', event => {
    if (!eligibleCart()) { selected = ''; render(); updateCartSafely(); return; }
    const value = event.target.value;
    selected = ['coupon', 'shipping'].includes(value) ? value : '';
    if (selected === 'shipping' && !document.querySelector('#shippingToggle')?.classList.contains('active')) selected = '';
    render(); updateCartSafely();
  });

  // El panel visual usa el mismo evento y las mismas validaciones del selector original.
  const extraDialog = $('cartExtraDialog');
  const extraTrigger = $('cartExtraTrigger');
  const closeExtras = () => { if (extraDialog.open) extraDialog.close(); };
  extraTrigger.addEventListener('click', () => {
    if (!eligibleCart() || extraDialog.open) return;
    render();
    extraDialog.showModal();
    extraTrigger.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('cart-extra-open');
    (extraDialog.querySelector('[aria-checked="true"]:not(:disabled)') || extraDialog.querySelector('[data-extra-value]:not(:disabled)'))?.focus();
  });
  extraDialog.querySelector('[data-extra-close]').addEventListener('click', closeExtras);
  extraDialog.addEventListener('close', () => {
    extraTrigger.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('cart-extra-open');
    const focusTarget = !extraTrigger.disabled && !extraTrigger.closest('[hidden]') ? extraTrigger : document.querySelector('#cartModal .close-cart');
    focusTarget?.focus({ preventScroll: true });
  });
  extraDialog.addEventListener('cancel', event => { event.preventDefault(); closeExtras(); });
  extraDialog.addEventListener('click', event => {
    const option = event.target.closest('[data-extra-value]');
    if (option && !option.disabled && eligibleCart()) {
      const choice = $('daymarBenefitSelect');
      choice.value = option.dataset.extraValue;
      choice.dispatchEvent(new Event('change', { bubbles: true }));
      closeExtras();
    } else if (event.target === extraDialog) {
      const rect = extraDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeExtras();
    }
  });
  extraDialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation(); closeExtras(); return;
    }
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    const options = Array.from(extraDialog.querySelectorAll('[data-extra-value]:not(:disabled)'));
    const index = options.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
      : (index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + options.length) % options.length;
    options[next].focus();
  });

  $('whatsappBtn').addEventListener('click', event => {
    // Recalcular antes de abrir el borrador, sin enviar mensajes automáticamente.
    if (!member() && selected) {
      selected = '';
      if (typeof window.refreshDaymarPrices === 'function') window.refreshDaymarPrices();
    }
    updateCartSafely();
    if ($('whatsappBtn').style.display === 'none') event.preventDefault();
  });
  window.DaymarPromo = Object.freeze({
    initialize, setUser, isGoogleMember:member, quote,
    syncCart:subtotal => {
      // Recibir el subtotal del cálculo de updateCart; nunca leer un total viejo del DOM.
      cartSubtotalCents = cents(subtotal);
      if (!eligibleCart() || (selected === 'shipping' && !document.querySelector('#shippingToggle')?.classList.contains('active'))) selected = '';
      render();
    }
  });
  render();
})();

