const root = document.querySelector('[data-game-root]');

if (root) {
  const panels = new Map(
    [...root.querySelectorAll('[data-state]')].map((panel) => [panel.dataset.state, panel]),
  );

  const canvas = root.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = root.querySelector('[data-score]');
  const finalScoreEl = root.querySelector('[data-final-score]');

  const world = {
    gravity: 0.56,
    jumpVelocity: -9.7,
    speed: 4.4,
    player: { x: 58, y: 0, w: 22, h: 28, vy: 0, grounded: true },
    floorY: canvas.height - 30,
    obstacles: [],
    orbs: [],
    stars: [],
    ticks: 0,
    score: 0,
    running: false,
    spawnGap: 95,
    orbGap: 180,
    frenzyTicks: 0,
    swipeStartY: null,
  };

  function setupCanvas() {
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const cssWidth = 360;
    const cssHeight = 220;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    world.floorY = cssHeight - 30;

    world.stars = Array.from({ length: 32 }, () => ({
      x: Math.random() * cssWidth,
      y: Math.random() * (cssHeight * 0.6),
      size: Math.random() * 2 + 0.5,
    }));
  }

  function setState(nextState) {
    panels.forEach((panel, stateName) => {
      panel.classList.toggle('is-active', stateName === nextState);
    });
  }

  function resetGame() {
    world.player.y = world.floorY - world.player.h;
    world.player.vy = 0;
    world.player.grounded = true;
    world.obstacles = [];
    world.orbs = [];
    world.ticks = 0;
    world.score = 0;
    world.speed = 4.4;
    world.spawnGap = 95;
    world.orbGap = 180;
    world.frenzyTicks = 0;
    scoreEl.textContent = '0';
    drawFrame();
  }

  function jump() {
    if (!world.running) return;
    if (world.player.grounded) {
      world.player.vy = world.jumpVelocity;
      world.player.grounded = false;
    }
  }

  function spawnObstacle() {
    const tall = Math.random() > 0.5;
    const h = tall ? 30 : 22;
    world.obstacles.push({
      x: 375,
      y: world.floorY - h,
      w: tall ? 18 : 24,
      h,
    });
  }

  function spawnOrb() {
    world.orbs.push({ x: 382, y: world.floorY - (58 + Math.random() * 56), r: 6 });
  }

  function collides(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function intersectsOrb(player, orb) {
    const cx = player.x + player.w / 2;
    const cy = player.y + player.h / 2;
    const dx = cx - orb.x;
    const dy = cy - orb.y;
    return dx * dx + dy * dy < (player.w / 2 + orb.r) ** 2;
  }

  function update() {
    world.ticks += 1;
    world.score += world.frenzyTicks > 0 ? 1.8 : 1;

    if (world.ticks % world.spawnGap === 0) spawnObstacle();
    if (world.ticks % world.orbGap === 0) spawnOrb();

    world.player.vy += world.gravity;
    world.player.y += world.player.vy;

    if (world.player.y + world.player.h >= world.floorY) {
      world.player.y = world.floorY - world.player.h;
      world.player.vy = 0;
      world.player.grounded = true;
    }

    world.speed += 0.0009;

    for (const obstacle of world.obstacles) {
      obstacle.x -= world.speed;
      if (collides(world.player, obstacle)) {
        gameOver();
      }
    }

    for (const orb of world.orbs) {
      orb.x -= world.speed;
      if (intersectsOrb(world.player, orb)) {
        world.score += 25;
        world.frenzyTicks = 240;
        orb.hit = true;
      }
    }

    world.obstacles = world.obstacles.filter((obstacle) => obstacle.x + obstacle.w > -10);
    world.orbs = world.orbs.filter((orb) => orb.x + orb.r > -10 && !orb.hit);

    if (world.spawnGap > 70 && world.ticks % 360 === 0) {
      world.spawnGap -= 2;
    }

    if (world.orbGap > 130 && world.ticks % 420 === 0) {
      world.orbGap -= 4;
    }

    if (world.frenzyTicks > 0) {
      world.frenzyTicks -= 1;
    }

    scoreEl.textContent = String(Math.floor(world.score / 8));
  }

  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, 220);
    grad.addColorStop(0, '#18002f');
    grad.addColorStop(1, '#080b1c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 360, 220);

    for (const star of world.stars) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    ctx.strokeStyle = 'rgba(60, 244, 255, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 18; i += 1) {
      const y = 220 - i * 12;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(360, y);
      ctx.stroke();
    }

    ctx.strokeStyle = world.frenzyTicks > 0 ? 'rgba(255, 224, 102, 0.65)' : 'rgba(255, 46, 166, 0.45)';
    for (let i = 0; i < 360; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i - (world.ticks % 30), world.floorY);
      ctx.lineTo(180, 110);
      ctx.stroke();
    }
  }

  function drawFrame() {
    drawBackground();

    ctx.fillStyle = world.frenzyTicks > 0 ? '#ffe066' : '#ff2ea6';
    ctx.fillRect(0, world.floorY, 360, 3);

    ctx.fillStyle = world.frenzyTicks > 0 ? '#ffe066' : '#3cf4ff';
    ctx.shadowColor = world.frenzyTicks > 0 ? '#ffe066' : '#3cf4ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(world.player.x, world.player.y, world.player.w, world.player.h);

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffe066';
    for (const obstacle of world.obstacles) {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
    }

    for (const orb of world.orbs) {
      ctx.beginPath();
      ctx.fillStyle = '#ff7ad9';
      ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    if (!world.running) return;
    update();
    drawFrame();
    requestAnimationFrame(loop);
  }

  function start() {
    resetGame();
    setState('playing');
    world.running = true;
    requestAnimationFrame(loop);
  }

  function pause() {
    if (!world.running) return;
    world.running = false;
    setState('paused');
  }

  function resume() {
    if (world.running) return;
    world.running = true;
    setState('playing');
    requestAnimationFrame(loop);
  }

  function gameOver() {
    world.running = false;
    const finalScore = Math.floor(world.score / 8);
    finalScoreEl.textContent = String(finalScore);
    setState('gameover');
  }

  root.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-action]');

    if (actionButton) {
      const action = actionButton.dataset.action;
      if (action === 'start' || action === 'restart') start();
      if (action === 'pause') pause();
      if (action === 'resume') resume();
      return;
    }

    if (panels.get('playing').classList.contains('is-active')) {
      jump();
    }
  });

  root.addEventListener('pointerdown', (event) => {
    if (event.target.closest('[data-action]')) return;
    if (panels.get('playing').classList.contains('is-active')) {
      event.preventDefault();
      jump();
    }
  });

  root.addEventListener('touchstart', (event) => {
    world.swipeStartY = event.changedTouches[0].clientY;
  });

  root.addEventListener('touchend', (event) => {
    const endY = event.changedTouches[0].clientY;
    if (world.swipeStartY !== null && world.swipeStartY - endY > 30) {
      jump();
    }
    world.swipeStartY = null;
  });

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      event.preventDefault();
      jump();
    }
  });

  setupCanvas();
  resetGame();
}
