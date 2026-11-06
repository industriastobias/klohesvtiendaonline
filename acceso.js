(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const googleButton = byId('daymarGoogleSignIn');
  const status = byId('daymarAuthStatus');
  const account = byId('daymarAccount');
  const signInOptions = byId('daymarSignInOptions');
  const menuEntryLabel = byId('daymarLoginEntryLabel');
  const menuEmail = byId('daymarMenuAccountEmail');
  const menuAvatar = byId('daymarMenuAccountAvatar');
  const menuIcon = byId('daymarLoginIcon');
  const menuSignOut = byId('daymarMenuSignOut');
  const signOutButton = byId('daymarSignOut');
  const accountTriggers = Array.from(document.querySelectorAll('[data-daymar-account-trigger]'));
  const avatars = Array.from(document.querySelectorAll('.daymar-user-avatar'));
  let sdk = null;
  let auth = null;
  let provider = null;
  let ready = false;
  let busy = false;
  let currentUser = null;
  let persistenceNotice = '';
  const SDK_VERSION = '12.4.0';

  function message(text, error = false) {
    status.textContent = text;
    status.classList.toggle('is-error', error);
  }

  function explainError(error) {
    const messages = {
      'auth/unauthorized-domain': 'Este dominio no está autorizado. Agrega industriastobias.github.io en Firebase Authentication → Configuración → Dominios autorizados.',
      'auth/operation-not-allowed': 'El acceso con Google no está habilitado. Revisa el proveedor Google en Firebase Authentication.',
      'auth/invalid-api-key': 'La configuración web de Firebase no es válida. Revisa el firebaseConfig exacto de esta app.',
      'auth/app-not-authorized': 'La app no está autorizada. Revisa los dominios y las restricciones de la API key pública en Firebase/Google Cloud.',
      'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo.',
      'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite ventanas emergentes para este sitio y vuelve a tocar Continuar con Google.',
      'auth/popup-closed-by-user': 'Cerraste la ventana de Google. Puedes volver a intentarlo.',
      'auth/cancelled-popup-request': 'Ya había una ventana de acceso abierta. Intenta de nuevo.',
      'auth/operation-not-supported-in-this-environment': 'Abre la tienda en Safari, Chrome o un navegador completo mediante HTTPS.',
      'auth/web-storage-unsupported': 'El navegador bloqueó el almacenamiento del acceso. Revisa su configuración de privacidad.',
      'auth/network-request-failed': 'No se pudo conectar. Revisa tu conexión y permite Firebase en tu navegador.',
      'auth/user-disabled': 'Esta cuenta está deshabilitada. Comunícate con DAYMAR.',
      'auth/account-exists-with-different-credential': 'Este correo ya tiene una cuenta con otro método de acceso. Comunícate con DAYMAR; no se vinculan cuentas automáticamente.',
      'auth/invalid-credential': 'No se pudo validar el acceso con Google. Intenta de nuevo.',
      'auth/internal-error': 'El servicio de acceso respondió con un error. Intenta nuevamente.'
    };
    return messages[error?.code] || 'No se pudo completar el acceso. Intenta de nuevo. ' +
      (error?.code ? '(' + error.code + ')' : 'Revisa tu conexión o la configuración de Firebase.');
  }

  function refreshControls() {
    const unavailable = !ready || busy;
    googleButton.disabled = unavailable;
    signOutButton.disabled = unavailable;
    menuSignOut.disabled = unavailable;
    byId('daymarLoginDialog').setAttribute('aria-busy', String(busy));
  }

  function safePhotoURL(value) {
    if (!value) return '';
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : '';
    } catch (_) { return ''; }
  }

  avatars.forEach(avatar => {
    const image = avatar.querySelector('[data-daymar-profile-photo]');
    const fallback = avatar.querySelector('[data-daymar-profile-fallback]');
    image.addEventListener('error', () => {
      image.hidden = true;
      fallback.hidden = false;
    });
  });

  function renderAvatar(avatar, user) {
    const image = avatar.querySelector('[data-daymar-profile-photo]');
    const fallback = avatar.querySelector('[data-daymar-profile-fallback]');
    const label = user?.displayName || user?.email || 'Cliente DAYMAR';
    const initial = Array.from(label.trim())[0] || 'D';
    fallback.textContent = initial.toLocaleUpperCase('es');
    const url = safePhotoURL(user?.photoURL);
    image.alt = user ? 'Foto de perfil de ' + label : '';
    if (url) {
      // Conservar el fallback si esta misma URL ya falló; no mostrar imágenes rotas.
      if (image.getAttribute('src') !== url) {
        image.hidden = false;
        fallback.hidden = true;
        image.src = url;
      }
    } else {
      image.hidden = true;
      image.removeAttribute('src');
      fallback.hidden = false;
    }
  }

  function renderUser(user) {
    currentUser = user;
    if (window.DaymarSistema) window.DaymarSistema.setUser(user);
    const signedIn = !!user;
    const email = user?.email || '';
    const name = user?.displayName || 'Cliente DAYMAR';
    byId('daymarLoginDialog').classList.toggle('is-signed-in', signedIn);
    signInOptions.hidden = signedIn;
    account.hidden = !signedIn;
    menuSignOut.hidden = !signedIn;
    menuAvatar.hidden = !signedIn;
    menuIcon.hidden = signedIn;
    menuEmail.hidden = !signedIn;
    menuEmail.textContent = signedIn ? (email || 'Correo no disponible') : '';
    menuEmail.title = email;
    menuEntryLabel.textContent = signedIn ? 'Mi cuenta' : 'Iniciar sesión';
    byId('daymarLoginTitle').textContent = signedIn ? 'Mi cuenta' : 'Tu cuenta DAYMAR';
    const premium = Boolean(user?.providerData?.some(item => item.providerId === 'google.com'));
    byId('daymarLoginDescription').textContent = premium ? 'PREMIUM' : 'BASIC';
    byId('daymarAccountName').textContent = signedIn ? name : '';
    byId('daymarAccountContact').textContent = signedIn ? (email || 'Correo no disponible') : '';
    avatars.forEach(avatar => renderAvatar(avatar, user));
    accountTriggers.forEach(button => {
      button.hidden = !signedIn;
      button.setAttribute('aria-label', signedIn ? 'Ver mi cuenta: ' + (email || name) : 'Ver mi cuenta');
      button.title = signedIn ? (email || name) : '';
    });
    message(persistenceNotice.trim());
    window.DaymarPromo?.setUser(user);
  }

  googleButton.addEventListener('click', () => {
    if (!ready || busy) return;
    busy = true;
    refreshControls();
    message('Continúa en la ventana de Google.');
    // Invocar desde el gesto del usuario, sin esperar imports ni persistencia en este handler.
    try {
      sdk.signInWithPopup(auth, provider)
        .catch(error => message(explainError(error), true))
        .finally(() => { busy = false; refreshControls(); });
    } catch (error) {
      busy = false;
      refreshControls();
      message(explainError(error), true);
    }
  });

  async function signOut() {
    if (!ready || busy) return;
    busy = true;
    refreshControls();
    try {
      await sdk.signOut(auth);
      renderUser(null);
      message('Sesión cerrada.');
      // Mantener carrito y favoritos locales; limpiar solo la presentación de la cuenta.
      if (typeof window.showNotification === 'function') window.showNotification('Sesión cerrada.');
    } catch (error) {
      window.openDaymarLogin();
      message(explainError(error), true);
    } finally {
      busy = false;
      refreshControls();
      if (!currentUser) {
        if (byId('daymarLoginOverlay').classList.contains('active')) googleButton.focus();
        else if (byId('categoriesMenu').classList.contains('active')) {
          byId('daymarLoginEntryLabel').closest('button').focus();
        }
      }
    }
  }
  signOutButton.addEventListener('click', signOut);
  menuSignOut.addEventListener('click', signOut);
  byId('daymarAuthRetry').addEventListener('click', () => window.location.reload());

  async function initializeAuth() {
    refreshControls();
    const config = typeof firebaseConfig !== 'undefined' ? firebaseConfig : null;
    if (!config || !['apiKey', 'authDomain', 'projectId', 'appId'].every(key =>
      typeof config[key] === 'string' && config[key].trim())) {
      message('El inicio de sesión aún no está disponible: falta el firebaseConfig exacto de la app web DAYMAR.', true);
      return;
    }
    message('Conectando con Google…');
    try {
      const [appSDK, authSDK] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/' + SDK_VERSION + '/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/' + SDK_VERSION + '/firebase-auth.js')
      ]);
      sdk = authSDK;
      const app = appSDK.initializeApp(config, 'daymar-storefront');
      auth = sdk.getAuth(app);
      auth.languageCode = 'es';
      window.DaymarPromo?.initialize(app, auth);
      provider = new sdk.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      try { await sdk.setPersistence(auth, sdk.browserLocalPersistence); }
      catch (_) {
        try {
          await sdk.setPersistence(auth, sdk.browserSessionPersistence);
          persistenceNotice = ' La sesión se conservará solo en esta pestaña.';
        } catch (_) {
          await sdk.setPersistence(auth, sdk.inMemoryPersistence);
          persistenceNotice = ' Tu navegador limita el almacenamiento; deberás ingresar de nuevo al recargar.';
        }
      }
      ready = true;
      refreshControls();
      sdk.onAuthStateChanged(auth, renderUser, error => {
        renderUser(null);
        message(explainError(error), true);
      });
    } catch (error) {
      message(explainError(error), true);
      ready = false;
      byId('daymarAuthRetry').hidden = false;
      refreshControls();
    }
  }
  initializeAuth();
})();
