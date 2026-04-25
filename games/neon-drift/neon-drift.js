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
    speed: 4.5,
    player: { x: 58, y: 0, w: 22, h: 28, vy: 0, grounded: true },
    floorY: canvas.height - 30,
    obstacles: [],
    ticks: 0,
    score: 0,
    running: false,
    spawnGap: 95,
    swipeStartY: null,
  };

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
    world.ticks = 0;
    world.score = 0;
    world.speed = 4.5;
    world.spawnGap = 95;
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
      x: canvas.width + 15,
      y: world.floorY - h,
      w: tall ? 18 : 24,
      h,
    });
  }

  function collides(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function update() {
    world.ticks += 1;
    world.score += 1;

    if (world.ticks % world.spawnGap === 0) spawnObstacle();

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

    world.obstacles = world.obstacles.filter((obstacle) => obstacle.x + obstacle.w > -10);

    if (world.spawnGap > 70 && world.ticks % 360 === 0) {
      world.spawnGap -= 2;
    }

    scoreEl.textContent = String(Math.floor(world.score / 8));
  }

  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#18002f');
    grad.addColorStop(1, '#080b1c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(60, 244, 255, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 18; i += 1) {
      const y = canvas.height - i * 12;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 46, 166, 0.45)';
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i - (world.ticks % 30), world.floorY);
      ctx.lineTo(canvas.width / 2, canvas.height / 2);
      ctx.stroke();
    }
  }

  function drawFrame() {
    drawBackground();

    ctx.fillStyle = '#ff2ea6';
    ctx.fillRect(0, world.floorY, canvas.width, 3);

    ctx.fillStyle = '#3cf4ff';
    ctx.shadowColor = '#3cf4ff';
    ctx.shadowBlur = 9;
    ctx.fillRect(world.player.x, world.player.y, world.player.w, world.player.h);

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#ffe066';
    for (const obstacle of world.obstacles) {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
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

  root.addEventListener('touchstart', (event) => {
    world.swipeStartY = event.changedTouches[0].clientY;
    if (panels.get('playing').classList.contains('is-active')) jump();
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

  drawFrame();
}
