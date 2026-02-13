(function () {
  'use strict';

  const CONFETTI_COLORS = ['#e8b4c8', '#d4a5b8', '#f0c4c4', '#e8e0f0', '#f5e6d3'];
  const CONFETTI_COUNT = 80;
  const FIREWORK_COLORS = ['#e8b4c8', '#d4a5b8', '#f0c4c4', '#c495a8'];
  const HEART_SYMBOLS = ['♥', '💖', '💗', '💘'];

  function createConfettiContainer() {
    let el = document.getElementById('confetti-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'confetti-container';
      document.body.appendChild(el);
    }
    return el;
  }

  function createConfetti() {
    const container = createConfettiContainer();
    container.innerHTML = '';

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = [
        'position: absolute',
        'width: ' + (6 + Math.random() * 6) + 'px',
        'height: ' + (4 + Math.random() * 4) + 'px',
        'background: ' + CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        'left: ' + Math.random() * 100 + 'vw',
        'top: -20px',
        'transform: rotate(' + Math.random() * 360 + 'deg)',
        'animation: confetti-fall ' + (2 + Math.random() * 2) + 's ease-out forwards',
        'animation-delay: ' + Math.random() * 0.5 + 's'
      ].join('; ');
      container.appendChild(piece);
    }

    const style = document.createElement('style');
    if (!document.getElementById('confetti-style')) {
      style.id = 'confetti-style';
      style.textContent = `
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0.3;
          }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(function () {
      container.innerHTML = '';
    }, 4000);
  }

  function runFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];

    function Particle(x, y, color, vx, vy, life) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.vx = vx;
      this.vy = vy;
      this.life = life;
      this.decay = 0.015 + Math.random() * 0.01;
    }

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.15;
      this.life -= this.decay;
    };

    Particle.prototype.draw = function () {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    function burst(x, y) {
      const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      const count = 30 + Math.floor(Math.random() * 20);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random();
        const speed = 4 + Math.random() * 6;
        particles.push(new Particle(
          x, y, color,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed - 2,
          1
        ));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) particles.splice(i, 1);
      }

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    }

    function launchFirework() {
      const x = window.innerWidth * (0.2 + Math.random() * 0.6);
      const y = window.innerHeight * (0.4 + Math.random() * 0.4);
      burst(x, y);
      animate();
    }

    launchFirework();
    setTimeout(launchFirework, 400);
    setTimeout(launchFirework, 800);
    setTimeout(launchFirework, 1200);
    setTimeout(launchFirework, 1600);
  }

  function createFloatingHearts() {
    const container = document.getElementById('celebration-hearts');
    if (!container) return;

    for (let i = 0; i < 15; i++) {
      const heart = document.createElement('span');
      heart.className = 'celebration-heart';
      heart.textContent = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
      heart.style.cssText = [
        'position: absolute',
        'font-size: ' + (20 + Math.random() * 24) + 'px',
        'left: ' + Math.random() * 100 + '%',
        'top: ' + Math.random() * 100 + '%',
        'opacity: 0.6',
        'animation: float-celebration-heart ' + (3 + Math.random() * 4) + 's ease-in-out infinite',
        'animation-delay: ' + Math.random() * 2 + 's'
      ].join('; ');
      container.appendChild(heart);
    }

    const style = document.createElement('style');
    if (!document.getElementById('celebration-hearts-style')) {
      style.id = 'celebration-hearts-style';
      style.textContent = `
        @keyframes float-celebration-heart {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          50% { transform: translate(10px, -15px) scale(1.1); opacity: 0.9; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function startCelebration() {
    const video = document.querySelector('.celebration-video');
    if (video) {
      video.currentTime = 0;
      video.play().catch(function () {});
    }
    createConfetti();
    runFireworks();
    createFloatingHearts();
  }

  window.startCelebration = startCelebration;

  document.addEventListener('DOMContentLoaded', function () {
    const btnReplay = document.getElementById('btn-replay');
    if (btnReplay) {
      btnReplay.addEventListener('click', function () {
        window.location.reload();
      });
    }
  });
})();
