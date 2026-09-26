/**
 * AURA — Interactive & Kinetic Animation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. SMOOTH SCROLL (LENIS) + GSAP SCROLLTRIGGER SYNC
     ========================================================================== */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /* ==========================================================================
     2. DYNAMIC REAL-TIME CLOCK
     ========================================================================== */
  const timeEl = document.getElementById('current-time');
  function updateTime() {
    if (!timeEl) return;
    const now = new Date();
    const utcString = now.toTimeString().split(' ')[0] + ' UTC';
    timeEl.textContent = utcString;
  }
  updateTime();
  setInterval(updateTime, 1000);

  /* ==========================================================================
     3. BESPOKE CUSTOM CURSOR & MAGNETIC BUTTONS
     ========================================================================== */
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  const cursorText = follower ? follower.querySelector('.cursor-text') : null;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lerp loop for cursor
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.5;
    cursorY += (mouseY - cursorY) * 0.5;
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    if (cursor) cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    if (follower) follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor Hover Targets
  const hoverElements = document.querySelectorAll('a, button, [data-cursor="hover"]');
  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      follower.classList.remove('hovering');
    });
  });

  // "Explore" Project Cards Cursor
  const exploreElements = document.querySelectorAll('[data-cursor="explore"]');
  exploreElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      follower.classList.add('explore');
      if (cursorText) cursorText.textContent = 'EXPLORE';
    });
    el.addEventListener('mouseleave', () => {
      follower.classList.remove('explore');
      if (cursorText) cursorText.textContent = '';
    });
  });

  // Magnetic Buttons Attraction
  const magneticButtons = document.querySelectorAll('[data-cursor="magnetic"]');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });

  /* ==========================================================================
     4. SPOTLIGHT CARD MOUSE TRACKER
     ========================================================================== */
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     5. GSAP KINETIC ENTRANCE TIMELINES
     ========================================================================== */
  gsap.registerPlugin(ScrollTrigger);

  // Hero Section Reveal
  const heroTL = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

  heroTL
    .from('.hero-badge', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 })
    .from(
      '.reveal-line',
      {
        y: '100%',
        duration: 1.3,
        stagger: 0.12,
        ease: 'power3.out',
      },
      '-=0.5'
    )
    .from('.hero-desc', { opacity: 0, y: 30, duration: 1 }, '-=0.8')
    .from('.hero-actions', { opacity: 0, y: 30, duration: 1 }, '-=0.8');

  // Numerical Counter Animation
  const counters = document.querySelectorAll('.counter');
  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2.2,
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
        start: 'top 85%',
      },
      opacity: 0,
      y: 40,
      duration: 0.9,
      delay: i * 0.1,
      ease: 'power3.out',
    });
  });

  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      },
      opacity: 0,
      y: 50,
      scale: 0.96,
      duration: 1,
      delay: (i % 2) * 0.15,
      ease: 'power3.out',
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
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            display: 'block',
            ease: 'power2.out',
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            display: 'none',
            ease: 'power2.in',
          });
        }
      });
    });
  });

  /* ==========================================================================
     7. BACKGROUND CANVAS: CONSTELLATION & FLOATING GLOW PARTICLES
     ========================================================================== */
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 65;

    function resizeBg() {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    }
    resizeBg();
    window.addEventListener('resize', resizeBg);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.8 + 0.6;
        this.alpha = Math.random() * 0.5 + 0.2;
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
      ctx.clearRect(0, 0, width, height);

      // Connect near particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#d4af37';
            ctx.globalAlpha = (1 - dist / 110) * 0.12;
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
     8. SENSORY LAB: INTERACTIVE HARMONIC WAVE SHADER SIMULATION
     ========================================================================== */
  const waveCanvas = document.getElementById('wave-canvas');
  if (waveCanvas) {
    const wCtx = waveCanvas.getContext('2d');
    let wWidth, wHeight;
    let waveMouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };

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
    });

    waveCanvas.addEventListener('mouseleave', () => {
      waveMouse.active = false;
    });

    let waveTime = 0;
    const lines = 32;

    function renderWave() {
      waveTime += 0.02;
      waveMouse.x += (waveMouse.targetX - waveMouse.x) * 0.08;
      waveMouse.y += (waveMouse.targetY - waveMouse.y) * 0.08;

      wCtx.fillStyle = '#060608';
      wCtx.fillRect(0, 0, wWidth, wHeight);

      for (let i = 0; i < lines; i++) {
        wCtx.beginPath();
        const progress = i / lines;
        const baseHeight = (wHeight * 0.2) + progress * (wHeight * 0.6);

        wCtx.strokeStyle = i % 2 === 0 ? `rgba(212, 175, 55, ${0.15 + progress * 0.4})` : `rgba(139, 92, 246, ${0.1 + progress * 0.3})`;
        wCtx.lineWidth = 1.4;

        for (let x = 0; x <= wWidth; x += 8) {
          const distToMouse = Math.hypot(x - waveMouse.x, baseHeight - waveMouse.y);
          const mouseInfluence = Math.max(0, 1 - distToMouse / 220);

          const sinWave = Math.sin(x * 0.008 + waveTime + i * 0.2) * 25;
          const cosWave = Math.cos(x * 0.015 - waveTime * 0.8) * 12;
          const distortion = mouseInfluence * Math.sin(waveTime * 3 + x * 0.03) * 60;

          const y = baseHeight + sinWave + cosWave + distortion;

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
    renderWave();
  }

  /* ==========================================================================
     9. GENERATIVE AMBIENT AUDIO (WEB AUDIO API SYNTHESIZER)
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

        // Ambient chord: Fundamental 110Hz (A2) + Harmonious fifth (164.81Hz - E3)
        droneOsc1 = audioCtx.createOscillator();
        droneOsc1.type = 'sine';
        droneOsc1.frequency.setValueAtTime(110, audioCtx.currentTime);

        droneOsc2 = audioCtx.createOscillator();
        droneOsc2.type = 'triangle';
        droneOsc2.frequency.setValueAtTime(164.81, audioCtx.currentTime);

        // Subtle lowpass filter for silky soft cinematic warmth
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

      // Smooth fade-in
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 2);

      isPlayingAudio = true;
      audioLabel.textContent = 'SOUND [ON]';
      audioBtn.classList.remove('sound-paused');
    } else {
      if (masterGain && audioCtx) {
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
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
