(function () {
  'use strict';

  const HEART_SYMBOLS = ['♥', '♡'];
  const COUNT = 10;
  const MIN_OPACITY = 0.25;
  const MAX_OPACITY = 0.5;
  const MIN_DURATION = 8;
  const MAX_DURATION = 15;

  const container = document.getElementById('particles-bg');
  if (!container) return;

  for (let i = 0; i < COUNT; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
    heart.style.cssText = [
      'position: fixed',
      'pointer-events: none',
      'font-size: ' + (14 + Math.random() * 12) + 'px',
      'opacity: ' + (MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY)),
      'left: ' + Math.random() * 100 + 'vw',
      'top: ' + Math.random() * 100 + 'vh',
      'color: #d4a5b8',
      'animation: float-heart ' + (MIN_DURATION + Math.random() * (MAX_DURATION - MIN_DURATION)) + 's ease-in-out infinite',
      'animation-delay: ' + Math.random() * 5 + 's'
    ].join('; ');
    container.appendChild(heart);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-heart {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(8px, -20px) rotate(5deg); }
      50% { transform: translate(-5px, -35px) rotate(-3deg); }
      75% { transform: translate(10px, -15px) rotate(4deg); }
    }
  `;
  document.head.appendChild(style);
})();
