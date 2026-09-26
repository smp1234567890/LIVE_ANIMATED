/**
 * AURA — High-Performance Kinetic Animation Engine
 * Optimized for silky-smooth 60-120 FPS
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. SMOOTH SCROLL (LENIS) - SNAPPY & LIGHTWEIGHT
     ========================================================================== */
  let lenis = null;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (typeof Lenis !== 'undefined' && !isTouchDevice) {
    lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1.0,
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ==========================================================================
     2. DYNAMIC REAL-TIME CLOCK (LIGHTWEIGHT TICKER)
     ========================================================================== */
  const timeEl = document.getElementById('current-time');
  function updateTime() {
    if (!timeEl) return;
    const now = new Date();
    timeEl.textContent = now.toTimeString().split(' ')[0] + ' UTC';
  }
  updateTime();
  setInterval(updateTime, 1000);

  /* ==========================================================================
     3. HIGH-PERFORMANCE GPU-COMPOSITED CURSOR
     ========================================================================== */
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  const cursorText = follower ? follower.querySelector('.cursor-text') : null;

  if (!isTouchDevice && cursor && follower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let followerX = mouseX;
    let followerY = mouseY;
    let currentScale = 1;
    let targetScale = 1;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderCursor() {
      // Direct interpolation
      cursorX += (mouseX - cursorX) * 0.6;
      cursorY += (mouseY - cursorY) * 0.6;
      followerX += (mouseX - followerX) * 0.2;
      followerY += (mouseY - followerY) * 0.2;
      currentScale += (targetScale - currentScale) * 0.2;

      cursor.style.transform = `translate3d(${cursorX - 4}px, ${cursorY - 4}px, 0)`;
      follower.style.transform = `translate3d(${followerX - 22}px, ${followerY - 22}px, 0) scale(${currentScale})`;

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover Elements
    const hoverElements = document.querySelectorAll('a, button, [data-cursor="hover"]');
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        follower.classList.add('hovering');
        targetScale = 1.4;
      });
      el.addEventListener('mouseleave', () => {
        follower.classList.remove('hovering');
        targetScale = 1;
      });
    });

    // "Explore" Project Cards
    const exploreElements = document.querySelectorAll('[data-cursor="explore"]');
    exploreElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        follower.classList.add('explore');
        targetScale = 1.8;
        if (cursorText) cursorText.textContent = 'EXPLORE';
      });
      el.addEventListener('mouseleave', () => {
        follower.classList.remove('explore');
        targetScale = 1;
        if (cursorText) cursorText.textContent = '';
      });
    });

    // Magnetic Buttons with fast spring release
    const magneticButtons = document.querySelectorAll('[data-cursor="magnetic"]');
    magneticButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          btn.style.transition = '';
        }, 400);
      });
    });
  }

  /* ==========================================================================
     4. OPTIMIZED SPOTLIGHT CARDS (RAF THROTTLED)
     ========================================================================== */
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach((card) => {
    let ticking = false;
    let cardMouseX = 0;
    let cardMouseY = 0;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      cardMouseX = e.clientX - rect.left;
      cardMouseY = e.clientY - rect.top;

      if (!ticking) {
        requestAnimationFrame(() => {
          card.style.setProperty('--mouse-x', `${cardMouseX}px`);
          card.style.setProperty('--mouse-y', `${cardMouseY}px`);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  });

  /* ==========================================================================
     5. GSAP KINETIC ENTRANCE TIMELINES
     ========================================================================== */
  gsap.registerPlugin(ScrollTrigger);

  // Hero Section Reveal
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.1 } });

  heroTL
    .from('.hero-badge', { opacity: 0, y: -15, duration: 0.6, delay: 0.1 })
    .from(
      '.reveal-line',
      {
        y: '100%',
        duration: 1.0,
        stagger: 0.08,
      },
      '-=0.4'
    )
    .from('.hero-desc', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
    .from('.hero-actions', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6');

  // Numerical Counter Animation
  const counters = document.querySelectorAll('.counter');
  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 1.8,
          ease: 'power2.out',
          snap: isDecimal ? { innerText: 0.1 } : { innerText: 1 },
          onUpdate: function () {
            counter.innerText = isDecimal
              ? Number(counter.innerText).toFixed(1)
              : Math.floor(counter.innerText);
          },
        });
      },
    });
  });

  // Scroll reveals for cards and sections
  gsap.utils.toArray('.spotlight-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true,
      },
      opacity: 0,
      y: 30,
      duration: 0.7,
      delay: i * 0.08,
      ease: 'power2.out',
    });
  });

  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true,
      },
      opacity: 0,
      y: 35,
      duration: 0.8,
      delay: (i % 2) * 0.1,
      ease: 'power2.out',
    });
  });

  /* ==========================================================================
     6. PORTFOLIO FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('bg-white', 'text-black', 'active');
        b.classList.add('bg-white/5', 'text-white/60');
      });

      btn.classList.add('bg-white', 'text-black', 'active');
      btn.classList.remove('bg-white/5', 'text-white/60');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          gsap.to(card, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        } else {
          gsap.to(card, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => { card.style.display = 'none'; },
          });
        }
      });
    });
  });

  /* ==========================================================================
     7. ULTRA-LIGHT BACKGROUND CANVAS (30 PARTICLES, PRE-SQUARED DISTANCE)
     ========================================================================== */
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 28; // Reduced for peak 120 FPS
    const maxDistSq = 90 * 90;
    let isBgRunning = true;

    function resizeBg() {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    }
    resizeBg();
    window.addEventListener('resize', resizeBg);

    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
      isBgRunning = !document.hidden;
      if (isBgRunning) renderBg();
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.15;
        this.color = Math.random() > 0.6 ? '#d4af37' : '#ffffff';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function renderBg() {
      if (!isBgRunning) return;

      ctx.clearRect(0, 0, width, height);

      // Fast distance check using squared dist (no Math.sqrt)
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dSq = dx * dx + dy * dy;

          if (dSq < maxDistSq) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#d4af37';
            ctx.globalAlpha = (1 - dSq / maxDistSq) * 0.1;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(renderBg);
    }
    renderBg();
  }

  /* ==========================================================================
     8. SENSORY LAB: INTERSECTION-OBSERVED WAVE SHADER
     (Stops running when scrolled out of view!)
     ========================================================================== */
  const waveCanvas = document.getElementById('wave-canvas');
  if (waveCanvas) {
    const wCtx = waveCanvas.getContext('2d');
    let wWidth, wHeight;
    let waveMouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
    let isWaveVisible = false;

    function resizeWave() {
      const rect = waveCanvas.getBoundingClientRect();
      wWidth = waveCanvas.width = rect.width;
      wHeight = waveCanvas.height = rect.height;
      waveMouse.targetX = wWidth / 2;
      waveMouse.targetY = wHeight / 2;
    }
    resizeWave();
    window.addEventListener('resize', resizeWave);

    waveCanvas.addEventListener('mousemove', (e) => {
      const rect = waveCanvas.getBoundingClientRect();
      waveMouse.targetX = e.clientX - rect.left;
      waveMouse.targetY = e.clientY - rect.top;
      waveMouse.active = true;
    }, { passive: true });

    waveCanvas.addEventListener('mouseleave', () => {
      waveMouse.active = false;
    });

    let waveTime = 0;
    const lines = 16; // Optimized from 32

    function renderWave() {
      if (!isWaveVisible) return;

      waveTime += 0.02;
      waveMouse.x += (waveMouse.targetX - waveMouse.x) * 0.08;
      waveMouse.y += (waveMouse.targetY - waveMouse.y) * 0.08;

      wCtx.fillStyle = '#060608';
      wCtx.fillRect(0, 0, wWidth, wHeight);

      for (let i = 0; i < lines; i++) {
        wCtx.beginPath();
        const progress = i / lines;
        const baseHeight = (wHeight * 0.2) + progress * (wHeight * 0.6);

        wCtx.strokeStyle = i % 2 === 0
          ? `rgba(212, 175, 55, ${0.15 + progress * 0.35})`
          : `rgba(139, 92, 246, ${0.1 + progress * 0.25})`;
        wCtx.lineWidth = 1.5;

        // Step by 16px (half the calculation overhead with smooth visual appearance)
        for (let x = 0; x <= wWidth; x += 16) {
          const dx = x - waveMouse.x;
          const dy = baseHeight - waveMouse.y;
          const distSq = dx * dx + dy * dy;
          const mouseInfluence = distSq < 40000 ? (1 - distSq / 40000) : 0;

          const sinWave = Math.sin(x * 0.008 + waveTime + i * 0.25) * 22;
          const distortion = mouseInfluence * Math.sin(waveTime * 3 + x * 0.03) * 50;

          const y = baseHeight + sinWave + distortion;

          if (x === 0) {
            wCtx.moveTo(x, y);
          } else {
            wCtx.lineTo(x, y);
          }
        }
        wCtx.stroke();
      }

      requestAnimationFrame(renderWave);
    }

    // IntersectionObserver: Only loop when visible on screen!
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isWaveVisible = entry.isIntersecting;
        if (isWaveVisible) {
          resizeWave();
          renderWave();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(waveCanvas);
  }

  /* ==========================================================================
     9. GENERATIVE AMBIENT AUDIO (NATIVE WEB AUDIO SYNTH)
     ========================================================================== */
  const audioBtn = document.getElementById('audio-toggle');
  const audioLabel = document.getElementById('audio-label');
  let audioCtx = null;
  let isPlayingAudio = false;
  let masterGain = null;
  let droneOsc1, droneOsc2;

  function toggleAudio() {
    if (!isPlayingAudio) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);

        droneOsc1 = audioCtx.createOscillator();
        droneOsc1.type = 'sine';
        droneOsc1.frequency.setValueAtTime(110, audioCtx.currentTime);

        droneOsc2 = audioCtx.createOscillator();
        droneOsc2.type = 'triangle';
        droneOsc2.frequency.setValueAtTime(164.81, audioCtx.currentTime);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, audioCtx.currentTime);

        droneOsc1.connect(filter);
        droneOsc2.connect(filter);
        filter.connect(masterGain);

        droneOsc1.start();
        droneOsc2.start();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.07, audioCtx.currentTime + 1.5);

      isPlayingAudio = true;
      audioLabel.textContent = 'SOUND [ON]';
      audioBtn.classList.remove('sound-paused');
    } else {
      if (masterGain && audioCtx) {
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1.0);
      }
      isPlayingAudio = false;
      audioLabel.textContent = 'SOUND [OFF]';
      audioBtn.classList.add('sound-paused');
    }
  }

  if (audioBtn) {
    audioBtn.classList.add('sound-paused');
    audioBtn.addEventListener('click', toggleAudio);
  }
});
