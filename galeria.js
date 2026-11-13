(() => {
  const gallery = document.querySelector('[data-daymar-gallery]');
  if (!gallery) return;

  const live = gallery.querySelector('[data-gallery-live]');
  const empty = gallery.querySelector('[data-gallery-empty]');
  const audioToggle = gallery.querySelector('[data-gallery-audio-toggle]');
  const frame = gallery.closest('.atelier-hero-art');
  let slides = [];
  let current = 0;
  let navigationRequest = 0;
  let gesture = null;
  let timer = null;
  let currentMediaRatio = 1;
  let audioEnabled = false;
  const videoAdvanceTimers = new WeakMap();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const syncFrameToMedia = (media) => {
    if (!frame || !media) return;
    const width = media.tagName === 'VIDEO' ? media.videoWidth : media.naturalWidth;
    const height = media.tagName === 'VIDEO' ? media.videoHeight : media.naturalHeight;
    if (!width || !height) return;
    const ratio = Math.max(.55, Math.min(1.8, width / height));
    currentMediaRatio = ratio;
    frame.style.setProperty('--daymar-gallery-ratio', String(ratio));
    gallery.style.setProperty('--daymar-gallery-ratio', String(ratio));
    frame.classList.add('daymar-dynamic-gallery-frame');
    const frameWidth = frame.getBoundingClientRect().width;
    if (frameWidth > 0) {
      frame.style.setProperty('height', `${Math.round(frameWidth / currentMediaRatio)}px`, 'important');
    }
  };

  const stopAuto = () => {
    clearTimeout(timer);
    timer = null;
  };

  const playVideo = (video) => {
    if (!video || video.tagName !== 'VIDEO') return;
    video.muted = !audioEnabled;
    video.defaultMuted = !audioEnabled;
    video.volume = audioEnabled ? 1 : 0;
    video.autoplay = true;
    video.controls = false;
    video.removeAttribute('controls');
    if (audioEnabled) video.removeAttribute('muted');
    else video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('preload', 'auto');
    if (video.readyState === 0 && video.networkState === 0) video.load();
    const attempt = () => video.play().then(() => scheduleVideoAdvance(video)).catch(() => {});
    attempt();
    setTimeout(attempt, 120);
    setTimeout(attempt, 700);
    setTimeout(attempt, 1500);
    setTimeout(attempt, 3000);
  };

  const updateAudioToggle = () => {
    const active = slides[current];
    const isVideo = active?.tagName === 'VIDEO';
    if (!audioToggle) return;
    audioToggle.hidden = !isVideo;
    if (!isVideo) return;
    const isEnabled = audioEnabled && !active.muted;
    audioToggle.setAttribute('aria-pressed', String(isEnabled));
    audioToggle.setAttribute('aria-label', isEnabled ? 'Silenciar video' : 'Activar sonido del video');
    audioToggle.innerHTML = `<i class="fas ${isEnabled ? 'fa-volume-high' : 'fa-volume-mute'}" aria-hidden="true"></i><span>${isEnabled ? 'Silenciar' : 'Activar sonido'}</span>`;
  };
  if (audioToggle) {
    audioToggle.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const active = slides[current];
      if (active?.tagName !== 'VIDEO') return;
      audioEnabled = !audioEnabled;
      active.muted = !audioEnabled;
      active.defaultMuted = !audioEnabled;
      active.volume = audioEnabled ? 1 : 0;
      updateAudioToggle();
      try { window.dispatchEvent(new CustomEvent('daymar-audio', { detail: { on: audioEnabled } })); } catch (e) {}
      if (active.paused) active.play().catch(() => {});
    });
  }

  const scheduleVideoAdvance = (video) => {
    clearTimeout(videoAdvanceTimers.get(video));
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (!duration || slides.length < 2) {
      if (slides.length > 1 && video === slides[current]) {
        const fallbackTimer = setTimeout(() => {
          if (video === slides[current] && video.ended) navigate(current + 1);
        }, 15000);
        videoAdvanceTimers.set(video, fallbackTimer);
      }
      return;
    }
    const remaining = Math.max(0, duration - (Number.isFinite(video.currentTime) ? video.currentTime : 0));
    // Margen extra para evitar que Safari/Android avance antes de que termine
    // el último fotograma del video.
    const wait = Math.max(700, remaining * 1000 + 750);
    const advanceTimer = setTimeout(() => {
      if (video !== slides[current]) return;
      const currentDuration = Number.isFinite(video.duration) ? video.duration : duration;
      const currentTime = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      const reachedEnd = video.ended || currentTime >= currentDuration - .15;
      if (reachedEnd) navigate(current + 1);
      else scheduleVideoAdvance(video);
    }, wait);
    videoAdvanceTimers.set(video, advanceTimer);
  };

  const startAuto = () => {
    stopAuto();
    const active = slides[current];
    if (active?.tagName === 'VIDEO') return;
    if (slides.length > 1 && !document.hidden && !gesture) {
      // Las imágenes avanzan con un ritmo más ágil; los videos usan su duración real.
      timer = setTimeout(() => {
        if (slides[current]?.tagName !== 'VIDEO') navigate(current + 1);
      }, 3500);
    }
  };

  let precargaTimer = null;
  const update = (index) => {
    if (!slides.length) {
      stopAuto();
      empty.hidden = false;
      empty.textContent = 'No hay imágenes disponibles en carpetaimg.';
      live.textContent = empty.textContent;
      return;
    }
    current = ((index % slides.length) + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.dataset.gallerySlide = String(i);
      slide.classList.toggle('active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    live.textContent = `Imagen ${current + 1} de ${slides.length}`;
    const active = slides[current];
    updateAudioToggle();
    if (active.tagName === 'VIDEO') {
      playVideo(active);
      syncFrameToMedia(active);
      empty.hidden = active.readyState >= 2 || !!active.poster;
    } else {
      active.loading = 'eager';
      syncFrameToMedia(active);
      empty.hidden = active.complete && active.naturalWidth > 0;
    }
    slides.forEach((slide, i) => {
      if (slide.tagName === 'VIDEO' && i !== current) slide.pause();
    });
    if (!empty.hidden) empty.textContent = 'Cargando imágenes…';
    clearTimeout(precargaTimer);
    precargaTimer = setTimeout(() => {
      const nxt = slides[(current + 1) % slides.length];
      if (nxt && nxt.tagName === 'VIDEO' && nxt.preload !== 'auto') { nxt.autoplay = false; nxt.removeAttribute('autoplay'); nxt.preload = 'auto'; nxt.load(); }
    }, 1200);
  };

  const removeBroken = (slide) => {
    const index = slides.indexOf(slide);
    if (index < 0) return;
    const active = slides[current];
    slides.splice(index, 1);
    slide.remove();
    const nextIndex = active === slide ? Math.min(index, slides.length - 1) : slides.indexOf(active);
    update(Math.max(0, nextIndex));
    startAuto();
  };

  const navigate = async (index) => {
    if (slides.length < 2) return;
    stopAuto();
    const request = ++navigationRequest;
    const target = slides[((index % slides.length) + slides.length) % slides.length];
    if (target.tagName === 'VIDEO') {
      playVideo(target);
      if (target.readyState < 2) {
        await new Promise(resolve => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            target.removeEventListener('loadeddata', finish);
            target.removeEventListener('error', finish);
            resolve();
          };
          target.addEventListener('loadeddata', finish, { once: true });
          target.addEventListener('error', finish, { once: true });
          setTimeout(finish, 4000);
        });
      }
    } else {
      target.loading = 'eager';
      await new Promise(resolve => {
        if (target.complete) {
          resolve();
          return;
        }
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          target.removeEventListener('load', finish);
          target.removeEventListener('error', finish);
          resolve();
        };
        target.addEventListener('load', finish, { once: true });
        target.addEventListener('error', finish, { once: true });
        setTimeout(finish, 4000);
      });
      if (typeof target.decode === 'function' && target.naturalWidth > 0) {
        await Promise.race([
          target.decode().catch(() => {}),
          new Promise(resolve => setTimeout(resolve, 1200))
        ]);
      }
      if (target.complete && target.naturalWidth === 0) {
        removeBroken(target);
        return;
      }
    }
    if (request !== navigationRequest || !slides.includes(target)) return;
    update(slides.indexOf(target));
    startAuto();
  };

  // pan-y permite seguir desplazando la página verticalmente. No se bloquea
  // el zoom con dos dedos ni se usa preventDefault sobre los eventos táctiles.
  const finishGesture = () => {
    const previous = gesture;
    gesture = null;
    gallery.classList.remove('is-dragging');
    if (previous && gallery.hasPointerCapture(previous.id)) {
      gallery.releasePointerCapture(previous.id);
    }
    startAuto();
    return previous;
  };

  gallery.addEventListener('pointerdown', (event) => {
    if (event.target.closest?.('[data-gallery-audio-toggle]')) return;
    if (!event.isPrimary) { finishGesture(); return; }
    if (slides.length < 2 || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const active = slides[current];
    if (active?.tagName === 'VIDEO') {
      active.play().catch(() => {});
    }
    stopAuto();
    navigationRequest++;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    gallery.classList.add('is-dragging');
    gallery.setPointerCapture(event.pointerId);
  });

  gallery.addEventListener('pointerup', (event) => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const previous = finishGesture();
    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    const threshold = Math.max(36, Math.min(70, gallery.clientWidth * .1));
    if (Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy) * 1.25) {
      navigate(current + (dx < 0 ? 1 : -1));
    }
  });
  gallery.addEventListener('pointercancel', finishGesture);
  gallery.addEventListener('lostpointercapture', () => {
    gesture = null;
    gallery.classList.remove('is-dragging');
    startAuto();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAuto();
      navigationRequest++;
    } else {
      startAuto();
      if (slides[current]?.tagName === 'VIDEO') playVideo(slides[current]);
    }
  });
  reducedMotion.addEventListener('change', startAuto);

  // Alternativa accesible para computadora, sin botones sobre la fotografía.
  gallery.addEventListener('keydown', (event) => {
    if (event.target !== gallery || slides.length < 2) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  const initialize = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const manifestURL = new URL(gallery.dataset.galleryManifest, document.baseURI);
      const response = await fetch(manifestURL, { cache: 'no-store', signal: controller.signal });
      if (!response.ok) throw new Error(`Lista de imágenes: HTTP ${response.status}`);
      const filenames = await response.json();
      if (!Array.isArray(filenames)) throw new Error('imagenes.json debe contener una lista de nombres.');
      const valid = [];
      const seen = new Set();
      for (const filename of filenames) {
        if (typeof filename !== 'string' || !/^[A-Za-z0-9_-]+\.(?:png|jpe?g|webp|mp4|webm|ogg)$/i.test(filename)) {
          throw new Error('Usa nombres sin espacios y extensión png, jpg, jpeg, webp, mp4, webm u ogg.');
        }
        valid.push(filename);
      }

      slides = valid.map((filename, index) => {
        const isVideo = /\.(?:mp4|webm|ogg)$/i.test(filename);
        const slide = document.createElement(isVideo ? 'video' : 'img');
        slide.className = `hero-gallery-slide${isVideo ? ' hero-gallery-video' : ''}`;
        slide.alt = isVideo ? '' : `DAYMAR / DETALLES PARA CADA DÍA — imagen ${index + 1}`;
        slide.width = 1200;
        slide.height = 1200;
        slide.draggable = false;

        if (isVideo) {
          slide.autoplay = index === 0;
          slide.loop = false;
          slide.playsInline = true;
          slide.preload = index === 0 ? 'auto' : 'none';
          slide.muted = !audioEnabled;
          slide.defaultMuted = !audioEnabled;
          slide.volume = audioEnabled ? 1 : 0;
          if (index === 0) slide.setAttribute('autoplay', '');
          slide.setAttribute('muted', '');
          slide.setAttribute('playsinline', '');
          slide.setAttribute('webkit-playsinline', '');
          slide.poster = new URL(encodeURIComponent(filename.replace(/\.[^.]+$/, '-poster.jpg')), manifestURL).href;
          slide.setAttribute('aria-label', `DAYMAR / DETALLES PARA CADA DÍA — video ${index + 1}`);
          slide.controls = false;
          slide.removeAttribute('controls');
          const startVideo = () => {
            if (slide !== slides[current]) return;
            playVideo(slide);
            syncFrameToMedia(slide);
            if (slide === slides[current]) empty.hidden = false;
            update(current);
          };
          slide.addEventListener('loadedmetadata', startVideo);
          slide.addEventListener('canplay', startVideo);
          slide.addEventListener('canplaythrough', startVideo);
          slide.addEventListener('loadeddata', startVideo);
          slide.addEventListener('playing', () => scheduleVideoAdvance(slide));
          slide.addEventListener('timeupdate', () => {
            if (slide === slides[current] && !slide.paused) scheduleVideoAdvance(slide);
          });
          slide.addEventListener('ended', () => {
            const duration = Number.isFinite(slide.duration) ? slide.duration : 0;
            const reachedEnd = !duration || slide.currentTime >= duration - .25;
            if (slide === slides[current] && slides.length > 1 && reachedEnd) scheduleVideoAdvance(slide);
          });
        } else {
          slide.decoding = 'async';
          slide.loading = index === 0 ? 'eager' : 'lazy';
          slide.fetchPriority = index === 0 ? 'high' : 'low';
          slide.addEventListener('load', () => {
            syncFrameToMedia(slide);
            if (slide === slides[current]) empty.hidden = true;
          });
        }

        slide.addEventListener('error', () => removeBroken(slide));
        slide.src = new URL(encodeURIComponent(filename), manifestURL).href;
        gallery.appendChild(slide);
        if (isVideo && index === 0) {
          requestAnimationFrame(() => playVideo(slide));
        }
        return slide;
      });
      update(0);
      startAuto();
    } catch (error) {
      stopAuto();
      empty.hidden = false;
      empty.textContent = 'No se pudo cargar la galería. Revisa carpetaimg/imagenes.json.';
      live.textContent = empty.textContent;
      console.warn('DAYMAR: galería externa no disponible.', error);
    } finally {
      clearTimeout(timeout);
    }
  };

  const retryActiveVideo = () => {
    if (slides[current]?.tagName === 'VIDEO') playVideo(slides[current]);
  };
  const galleryVisibility = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        if (entries.some(entry => entry.isIntersecting)) retryActiveVideo();
      }, { threshold: 0.15 })
    : null;
  galleryVisibility?.observe(gallery);
  window.addEventListener('load', retryActiveVideo, { once: true });
  window.addEventListener('pageshow', retryActiveVideo);
  document.addEventListener('visibilitychange', retryActiveVideo);
  document.addEventListener('touchstart', retryActiveVideo, { passive: true, capture: true });
  initialize();
})();
