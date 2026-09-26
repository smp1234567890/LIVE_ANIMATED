/**
 * AURA — Haute Digital Craft & Kinetic Engine
 * 100% Zero-Lag 144Hz Architecture • Synesthetic Sound • World Clocks
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================================
     1. ZERO URL-CHANGE SMOOTH NAVIGATION (TABS & HOME)
     ========================================================================== */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    e.preventDefault(); // Never modify the browser's URL address bar!

    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 85; // Fixed header spacing
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });

  /* ==========================================================================
     2. GLOBAL ATELIER TIMEZONES (PARIS • NEW YORK • TOKYO)
     ========================================================================== */
  const timeHeader = document.getElementById('current-time');
  const clockParis = document.getElementById('clock-paris');
  const clockNY = document.getElementById('clock-ny');
  const clockTokyo = document.getElementById('clock-tokyo');

  function updateAtelierClocks() {
    const now = new Date();

    const formatTz = (tz, label) => {
      try {
        const timeStr = now.toLocaleTimeString('en-GB', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        return `${timeStr} ${label}`;
      } catch (err) {
        return now.toTimeString().split(' ')[0];
      }
    };

    const parisTime = formatTz('Europe/Paris', 'CET');
    const nyTime = formatTz('America/New_York', 'EST');
    const tokyoTime = formatTz('Asia/Tokyo', 'JST');

    if (timeHeader) timeHeader.textContent = `PARIS ${parisTime.substring(0, 5)}`;
    if (clockParis) clockParis.textContent = parisTime;
    if (clockNY) clockNY.textContent = nyTime;
    if (clockTokyo) clockTokyo.textContent = tokyoTime;
  }
  updateAtelierClocks();
  setInterval(updateAtelierClocks, 1000);

  /* ==========================================================================
     3. FAST GPU-ACCELERATED CURSOR
     ========================================================================== */
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  const cursorText = follower ? follower.querySelector('.cursor-text') : null;

  if (!isTouchDevice && cursor && follower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let targetScale = 1;
    let currentScale = 1;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
    }, { passive: true });

    function renderFollower() {
      followerX += (mouseX - followerX) * 0.25;
      followerY += (mouseY - followerY) * 0.25;
      currentScale += (targetScale - currentScale) * 0.25;

      follower.style.transform = `translate3d(${followerX - 19}px, ${followerY - 19}px, 0) scale(${currentScale})`;
      requestAnimationFrame(renderFollower);
    }
    requestAnimationFrame(renderFollower);

    // Hover Elements
    const hoverElements = document.querySelectorAll('a, button, [data-cursor="hover"]');
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        follower.classList.add('hovering');
        targetScale = 1.35;
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
        targetScale = 1.9;
        if (cursorText) cursorText.textContent = 'DISCOVER';
      });
      el.addEventListener('mouseleave', () => {
        follower.classList.remove('explore');
        targetScale = 1;
        if (cursorText) cursorText.textContent = '';
      });
    });

    // Magnetic Buttons (Snappy micro-pull)
    const magneticButtons = document.querySelectorAll('[data-cursor="magnetic"]');
    magneticButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
          btn.style.transition = '';
        }, 300);
      });
    });
  }

  /* ==========================================================================
     4. ELEGANT 3D CARD PERSPECTIVE TILT (Zero-Lag Transform)
     ========================================================================== */
  const projectCards = document.querySelectorAll('.project-card');
  if (!isTouchDevice) {
    projectCards.forEach((card) => {
      let isHovered = false;

      card.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      card.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Subtle 3D tilt angle
        const rotateY = x * 10;
        const rotateX = -y * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        card.style.transition = 'transform 0.4s ease';
        setTimeout(() => {
          card.style.transition = '';
        }, 400);
      });
    });
  }

  /* ==========================================================================
     5. CLEAN GSAP TIMELINES & SCROLLTRIGGERS
     ========================================================================== */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Entrance
    const heroTL = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.9 } });

    heroTL
      .from('.hero-badge', { opacity: 0, y: -10, duration: 0.5, delay: 0.1 })
      .from(
        '.reveal-line',
        {
          y: '100%',
          duration: 0.9,
          stagger: 0.07,
        },
        '-=0.3'
      )
      .from('.hero-desc', { opacity: 0, y: 15, duration: 0.6 }, '-=0.5')
      .from('.hero-actions', { opacity: 0, y: 15, duration: 0.6 }, '-=0.5');

    // Number Counters
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
            duration: 1.6,
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

    // Fast Card reveals
    gsap.utils.toArray('.spotlight-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          once: true,
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: i * 0.06,
        ease: 'power2.out',
      });
    });

    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          once: true,
        },
        opacity: 0,
        y: 25,
        duration: 0.6,
        delay: (i % 2) * 0.08,
        ease: 'power2.out',
      });
    });
  }

  /* ==========================================================================
     6. PORTFOLIO FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('bg-gold-500', 'text-black', 'font-semibold', 'active');
        b.classList.add('bg-white/5', 'text-white/60');
      });

      btn.classList.add('bg-gold-500', 'text-black', 'font-semibold', 'active');
      btn.classList.remove('bg-white/5', 'text-white/60');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  /* ==========================================================================
     7. GENERATIVE AMBIENT AUDIO & CRYSTAL HARMONICS
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

        // Elegant fundamental chord (A2 110Hz + E3 164.81Hz)
        droneOsc1 = audioCtx.createOscillator();
        droneOsc1.type = 'sine';
        droneOsc1.frequency.setValueAtTime(110, audioCtx.currentTime);

        droneOsc2 = audioCtx.createOscillator();
        droneOsc2.type = 'triangle';
        droneOsc2.frequency.setValueAtTime(164.81, audioCtx.currentTime);

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, audioCtx.currentTime);

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
      masterGain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 1.5);

      isPlayingAudio = true;
      audioLabel.textContent = 'ATMOSPHERE [ON]';
      audioBtn.classList.remove('sound-paused');
    } else {
      if (masterGain && audioCtx) {
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      }
      isPlayingAudio = false;
      audioLabel.textContent = 'ATMOSPHERE [OFF]';
      audioBtn.classList.add('sound-paused');
    }
  }

  if (audioBtn) {
    audioBtn.classList.add('sound-paused');
    audioBtn.addEventListener('click', toggleAudio);
  }
});
