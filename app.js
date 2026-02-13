(function () {
  'use strict';

  const TEXT_1 = 'Some people make ordinary days feel different.';
  const TEXT_2 = 'You do.';
  const TEXT_3 = 'Will you be my Valentine?';
  const NO_MESSAGES = [
    'Take your time.',
    "I'll wait.",
    'I believe good decisions take a second.'
  ];

  const proposalText = document.getElementById('proposal-text');
  const proposalScreen = document.getElementById('proposal-screen');
  const celebrationScreen = document.getElementById('celebration-screen');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const buttonsWrapper = document.querySelector('.buttons-wrapper');

  let attemptCount = 0;
  let questionRevealed = false;
  let lastNoAttempt = 0;
  let hasResponded = false;
  let noResponseSent = false;

  function getUserId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || 'my_crush';
  }

  function getTelegramUrl() {
    return window.location.origin + '/api/telegram';
  }

  function sendToTelegram(payload) {
    try {
      fetch(getTelegramUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (e) {}
  }

  function sendNoResponse() {
    if (noResponseSent || !questionRevealed || hasResponded) return;
    noResponseSent = true;
    const payload = {
      id: getUserId(),
      result: 'No response (closed tab)',
      attempts: attemptCount,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      userAgent: navigator.userAgent
    };
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(getTelegramUrl(), blob);
  }

  function moveNoButton() {
    const btn = btnNo;
    const rect = btn.getBoundingClientRect();
    const card = document.querySelector('.card');
    const cardRect = card ? card.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const margin = 12;

    const minX = cardRect.left + margin;
    const minY = cardRect.top + margin;
    const maxX = cardRect.left + cardRect.width - rect.width - margin;
    const maxY = cardRect.top + cardRect.height - rect.height - margin;

    const newX = minX + Math.random() * Math.max(0, maxX - minX);
    const newY = minY + Math.random() * Math.max(0, maxY - minY);

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = newX - centerX;
    const dy = newY - centerY;

    const rotation = (Math.random() - 0.5) * 24;
    const scale = Math.max(0.85, 1 - attemptCount * 0.02);

    btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) rotate(' + rotation + 'deg) scale(' + scale + ')';
  }

  function updateNoMessage() {
    const idx = Math.min(attemptCount - 1, NO_MESSAGES.length - 1);
    proposalText.textContent = NO_MESSAGES[idx];
  }

  function updateYesButton() {
    const scale = 1 + attemptCount * 0.08;
    const glow = 4 + attemptCount * 2;
    btnYes.style.transform = 'scale(' + scale + ')';
    btnYes.style.boxShadow = '0 ' + glow + 'px ' + (glow + 12) + 'px rgba(200, 140, 160, 0.5)';
    if (attemptCount >= 3) {
      btnYes.classList.add('pulse');
    }
  }

  function handleNoAttempt(e) {
    if (e.type === 'touchstart') {
      e.preventDefault();
    }
    if (!questionRevealed) return;
    const now = Date.now();
    if (now - lastNoAttempt < 250) return;
    lastNoAttempt = now;

    attemptCount++;
    moveNoButton();
    updateNoMessage();
    updateYesButton();
  }

  function handleYesClick() {
    if (!questionRevealed) return;
    hasResponded = true;

    const id = getUserId();
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    sendToTelegram({
      id: id,
      result: 'YES 💖',
      attempts: attemptCount,
      timestamp: timestamp,
      userAgent: navigator.userAgent
    });

    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    proposalScreen.classList.add('hidden');
    setTimeout(function () {
      celebrationScreen.classList.add('visible');
      if (window.startCelebration) {
        window.startCelebration();
      }
    }, 300);
  }

  function showText(text, then) {
    proposalText.textContent = text;
    proposalText.style.opacity = '1';
    if (then) {
      setTimeout(then, 2000);
    }
  }

  function initProposalText() {
    proposalText.style.opacity = '0';
    proposalText.style.transition = 'opacity 0.8s ease';
    buttonsWrapper.style.opacity = '0';
    buttonsWrapper.style.pointerEvents = 'none';

    showText(TEXT_1, function () {
      showText(TEXT_2, function () {
        showText(TEXT_3, function () {
          questionRevealed = true;
          proposalText.style.opacity = '1';
          buttonsWrapper.style.transition = 'opacity 0.6s ease';
          buttonsWrapper.style.opacity = '1';
          buttonsWrapper.style.pointerEvents = 'auto';
        });
      });
    });
  }

  btnNo.addEventListener('touchstart', handleNoAttempt, { passive: false });
  btnNo.addEventListener('click', handleNoAttempt);
  btnYes.addEventListener('click', handleYesClick);

  window.addEventListener('beforeunload', sendNoResponse);
  window.addEventListener('pagehide', sendNoResponse);

  initProposalText();
})();
