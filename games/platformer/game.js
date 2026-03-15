// ─── Jai's Platformer — 5 Levels ─────────────────────────────────────

async function loadConfig() {
  const res = await fetch('config.json');
  return res.json();
}

loadConfig().then(config => {
  const { gravity, jumpForce, canvasWidth, canvasHeight } = config.settings;
  const W = canvasWidth, H = canvasHeight;
  const PLAYER_SPEED = 3.2;
  const TOTAL_LEVELS  = 5;

  // ── Canvas ──
  const canvas = document.getElementById('gameCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = W;
  canvas.height = H;

  // ── HUD elements ──
  const scoreEl = document.getElementById('score-val');
  const livesEl = document.getElementById('lives-val');
  const levelEl = document.getElementById('level-val');

  // ── Overlay elements ──
  const overlay    = document.getElementById('overlay');
  const overlayH2  = document.getElementById('overlay-title');
  const overlayP   = document.getElementById('overlay-msg');
  const overlayBtn = document.getElementById('overlay-btn');

  // ── Game state ──
  let keys         = {};
  let state        = 'start';  // 'start' | 'playing' | 'levelup' | 'dead' | 'win'
  let score        = 0;
  let lives        = 5;
  let currentLevel = 1;
  let tick         = 0;
  let animId;
  let player, platforms, coins, obstacles;
  let levelUpTimer = 0;   // countdown frames (120 = 2 sec at 60 fps)

  // ── Ground top y shorthand ──
  const GH = H - 30;

  // ─────────────────────────────────────────────────────────────────
  //  Level definitions
  //  Each level adds more / faster obstacles and tighter platforms.
  //  Coins are auto-generated above every non-ground platform.
  //  Obstacle fields: x,y,w,h, minX,maxX, speed, vx (current direction)
  // ─────────────────────────────────────────────────────────────────
  const LEVELS = [

    // ── Level 1 ── wide platforms, zero obstacles ──────────────────
    {
      subtitle: 'Collect all the coins!',
      platforms: [
        { x:   0, y: GH,  w: W,   h: 30 },
        { x:  80, y: 350, w: 150, h: 16 },
        { x: 300, y: 295, w: 140, h: 16 },
        { x: 500, y: 255, w: 130, h: 16 },
        { x: 140, y: 225, w: 120, h: 16 },
        { x: 600, y: 185, w: 140, h: 16 },
        { x: 330, y: 158, w: 110, h: 16 },
        { x:  50, y: 178, w: 100, h: 16 },
      ],
      obstacles: [],
    },

    // ── Level 2 ── 1 slow ground patrol ───────────────────────────
    {
      subtitle: 'Watch out for the spiky obstacles!',
      platforms: [
        { x:   0, y: GH,  w: W,   h: 30 },
        { x:  60, y: 350, w: 120, h: 16 },
        { x: 240, y: 278, w: 110, h: 16 },
        { x: 430, y: 228, w: 120, h: 16 },
        { x: 590, y: 308, w: 110, h: 16 },
        { x: 660, y: 193, w: 110, h: 16 },
        { x: 170, y: 183, w: 100, h: 16 },
        { x:  50, y: 218, w:  80, h: 16 },
        { x: 340, y: 138, w: 120, h: 16 },
      ],
      obstacles: [
        { x: 350, y: GH - 16, w: 24, h: 16, minX: 150, maxX: 560, speed: 1.5, vx:  1.5 },
      ],
    },

    // ── Level 3 ── 3 obstacles (1 on a platform) ──────────────────
    {
      subtitle: 'More obstacles — stay sharp!',
      platforms: [
        { x:   0, y: GH,  w: W,   h: 30 },
        { x:  50, y: 358, w: 100, h: 16 },
        { x: 210, y: 298, w: 100, h: 16 },
        { x: 380, y: 248, w: 110, h: 16 },
        { x: 550, y: 308, w: 100, h: 16 },
        { x: 660, y: 218, w: 100, h: 16 },
        { x: 130, y: 208, w: 100, h: 16 },
        { x: 310, y: 163, w: 100, h: 16 },
        { x: 490, y: 163, w: 100, h: 16 },
        { x:  50, y: 153, w:  70, h: 16 },
        { x: 680, y: 143, w:  90, h: 16 },
      ],
      obstacles: [
        { x: 200, y: GH - 16,   w: 24, h: 16, minX:  80, maxX: 390, speed: 2.0, vx:  2.0 },
        { x: 500, y: GH - 16,   w: 24, h: 16, minX: 420, maxX: 690, speed: 2.0, vx: -2.0 },
        { x: 380, y: 248 - 16,  w: 24, h: 16, minX: 380, maxX: 466, speed: 1.8, vx:  1.8 },
      ],
    },

    // ── Level 4 ── 4 obstacles, faster, narrower platforms ────────
    {
      subtitle: 'Platforms are narrower. Be careful!',
      platforms: [
        { x:   0, y: GH,  w: W,   h: 30 },
        { x:  40, y: 368, w:  90, h: 16 },
        { x: 190, y: 308, w:  90, h: 16 },
        { x: 350, y: 258, w:  90, h: 16 },
        { x: 510, y: 318, w:  90, h: 16 },
        { x: 650, y: 248, w: 100, h: 16 },
        { x: 100, y: 218, w:  90, h: 16 },
        { x: 280, y: 183, w:  90, h: 16 },
        { x: 460, y: 198, w:  80, h: 16 },
        { x: 610, y: 163, w:  90, h: 16 },
        { x:  40, y: 153, w:  80, h: 16 },
        { x: 340, y: 118, w:  90, h: 16 },
      ],
      obstacles: [
        { x: 150, y: GH - 16,   w: 24, h: 16, minX:  50, maxX: 360, speed: 2.5, vx:  2.5 },
        { x: 450, y: GH - 16,   w: 24, h: 16, minX: 360, maxX: 630, speed: 2.5, vx: -2.5 },
        { x: 190, y: 308 - 16,  w: 24, h: 16, minX: 190, maxX: 256, speed: 2.0, vx:  2.0 },
        { x: 510, y: 318 - 16,  w: 24, h: 16, minX: 510, maxX: 576, speed: 2.0, vx:  2.0 },
      ],
    },

    // ── Level 5 ── Final boss: 6 fast obstacles ────────────────────
    {
      subtitle: 'Final challenge — can you survive?',
      platforms: [
        { x:   0, y: GH,  w: W,   h: 30 },
        { x:  30, y: 368, w:  80, h: 16 },
        { x: 170, y: 318, w:  80, h: 16 },
        { x: 320, y: 268, w:  80, h: 16 },
        { x: 470, y: 308, w:  80, h: 16 },
        { x: 620, y: 258, w:  80, h: 16 },
        { x: 700, y: 368, w:  70, h: 16 },
        { x:  90, y: 228, w:  80, h: 16 },
        { x: 250, y: 198, w:  80, h: 16 },
        { x: 420, y: 193, w:  80, h: 16 },
        { x: 570, y: 168, w:  80, h: 16 },
        { x: 680, y: 153, w:  80, h: 16 },
        { x:  30, y: 153, w:  80, h: 16 },
        { x: 330, y: 128, w: 100, h: 16 },
      ],
      obstacles: [
        { x: 100, y: GH - 16,   w: 24, h: 16, minX:  30, maxX: 315, speed: 3.0, vx:  3.0 },
        { x: 450, y: GH - 16,   w: 24, h: 16, minX: 320, maxX: 625, speed: 3.0, vx: -3.0 },
        { x: 650, y: GH - 16,   w: 24, h: 16, minX: 625, maxX: 775, speed: 2.8, vx:  2.8 },
        { x: 170, y: 318 - 16,  w: 24, h: 16, minX: 170, maxX: 226, speed: 2.5, vx:  2.5 },
        { x: 470, y: 308 - 16,  w: 24, h: 16, minX: 470, maxX: 526, speed: 2.5, vx:  2.5 },
        { x: 420, y: 193 - 16,  w: 24, h: 16, minX: 420, maxX: 476, speed: 2.2, vx:  2.2 },
      ],
    },
  ];

  // ─────────────────────────────────────────────────────────────────
  //  Build / reset helpers
  // ─────────────────────────────────────────────────────────────────
  function buildLevel(lvl) {
    const def = LEVELS[lvl - 1];
    platforms = def.platforms.map(p => ({ ...p }));
    obstacles = def.obstacles.map(o => ({ ...o }));

    // Auto-generate coins above each non-ground platform
    coins = [];
    platforms.slice(1).forEach(p => {
      const count = Math.max(1, Math.floor(p.w / 45));
      for (let i = 0; i < count; i++) {
        coins.push({
          x: p.x + 22 + i * 42,
          y: p.y - 22,
          r: 9,
          collected: false,
          bobOffset: Math.random() * Math.PI * 2,
        });
      }
    });
  }

  function buildPlayer() {
    player = {
      x: 60, y: GH - 46,
      w: 28, h: 36,
      vx: 0, vy: 0,
      onGround: false,
      facing: 1,
      jumpPressed: false,
      invincible: 0,   // frames of flashing invincibility after hit
    };
  }

  // ─────────────────────────────────────────────────────────────────
  //  Collision helpers
  // ─────────────────────────────────────────────────────────────────
  function rectOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  function resolvePlatformCollisions() {
    player.onGround = false;
    for (const p of platforms) {
      if (!rectOverlap(player.x, player.y, player.w, player.h, p.x, p.y, p.w, p.h)) continue;
      const ol = (player.x + player.w) - p.x;
      const or_ = (p.x + p.w) - player.x;
      const ot = (player.y + player.h) - p.y;
      const ob = (p.y + p.h) - player.y;
      if (Math.min(ot, ob) < Math.min(ol, or_)) {
        if (ot < ob) { player.y = p.y - player.h; player.vy = 0; player.onGround = true; }
        else         { player.y = p.y + p.h; if (player.vy < 0) player.vy = 0; }
      } else {
        player.x = ol < or_ ? p.x - player.w : p.x + p.w;
        player.vx = 0;
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────
  //  Update (one frame)
  // ─────────────────────────────────────────────────────────────────
  function update() {
    tick++;
    if (player.invincible > 0) player.invincible--;

    // ── Input ──
    const left  = keys['ArrowLeft']  || keys['a'] || keys['A'];
    const right = keys['ArrowRight'] || keys['d'] || keys['D'];
    const jump  = keys['ArrowUp']    || keys['w'] || keys['W'] || keys[' '];

    if (left)       { player.vx = -PLAYER_SPEED; player.facing = -1; }
    else if (right) { player.vx =  PLAYER_SPEED; player.facing =  1; }
    else            { player.vx *= 0.7; }

    if (jump && player.onGround && !player.jumpPressed) {
      player.vy = jumpForce;
      player.jumpPressed = true;
    }
    if (!jump) player.jumpPressed = false;

    player.vy += gravity;
    player.x  += player.vx;
    player.y  += player.vy;

    if (player.x < 0)             player.x = 0;
    if (player.x + player.w > W)  player.x = W - player.w;

    resolvePlatformCollisions();

    // ── Move obstacles ──
    for (const o of obstacles) {
      o.x += o.vx;
      if (o.x <= o.minX)        { o.x = o.minX;        o.vx =  Math.abs(o.vx); }
      if (o.x + o.w >= o.maxX)  { o.x = o.maxX - o.w; o.vx = -Math.abs(o.vx); }
    }

    // ── Obstacle hit ──
    if (player.invincible === 0) {
      for (const o of obstacles) {
        if (rectOverlap(player.x, player.y, player.w, player.h, o.x, o.y, o.w, o.h)) {
          takeHit();
          break;
        }
      }
    }

    // ── Fell off bottom ──
    if (player.y > H + 40) takeHit();

    // ── Coin collection ──
    for (const c of coins) {
      if (c.collected) continue;
      const dx = (player.x + player.w / 2) - c.x;
      const dy = (player.y + player.h / 2) - c.y;
      if (Math.hypot(dx, dy) < c.r + player.w / 2 - 4) {
        c.collected = true;
        score += 10 * currentLevel;   // higher levels = more points
        scoreEl.textContent = score;
      }
    }

    // ── Level complete ──
    if (state === 'playing' && coins.every(c => c.collected)) {
      if (currentLevel < TOTAL_LEVELS) {
        beginLevelUp();
      } else {
        showOverlay('win');
      }
    }
  }

  function takeHit() {
    lives--;
    livesEl.textContent = lives;
    if (lives <= 0) { showOverlay('game-over'); return; }
    buildPlayer();
    player.invincible = 90;  // 1.5 sec flashing invincibility
  }

  // ─────────────────────────────────────────────────────────────────
  //  Level-up splash (2-second transition)
  // ─────────────────────────────────────────────────────────────────
  function beginLevelUp() {
    state = 'levelup';
    cancelAnimationFrame(animId);
    currentLevel++;
    levelEl.textContent = currentLevel;
    levelUpTimer = 120;
    levelUpTick();
  }

  function levelUpTick() {
    levelUpTimer--;
    drawLevelSplash();
    if (levelUpTimer > 0) {
      requestAnimationFrame(levelUpTick);
    } else {
      buildLevel(currentLevel);
      buildPlayer();
      lives = 5;
      livesEl.textContent = lives;
      state = 'playing';
      tick = 0;
      loop();
    }
  }

  function drawLevelSplash() {
    draw();   // frozen previous level underneath

    // Dark vignette
    ctx.fillStyle = 'rgba(8, 8, 20, 0.78)';
    ctx.fillRect(0, 0, W, H);

    // Animated scale-in
    const t = 1 - levelUpTimer / 120;          // 0 → 1
    const scale = 0.4 + 0.6 * Math.min(1, t * 2.5);

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(scale, scale);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Big level number
    ctx.shadowColor = '#6C63FF';
    ctx.shadowBlur  = 40;
    ctx.fillStyle   = '#ffffff';
    ctx.font        = 'bold 80px Segoe UI, system-ui, sans-serif';
    ctx.fillText(`Level ${currentLevel}`, 0, -10);

    // Subtitle
    ctx.shadowBlur = 0;
    ctx.font       = '22px Segoe UI, system-ui, sans-serif';
    ctx.fillStyle  = '#aaaacc';
    const sub = LEVELS[currentLevel - 1].subtitle;
    ctx.fillText(sub, 0, 58);

    ctx.restore();
  }

  // ─────────────────────────────────────────────────────────────────
  //  Draw
  // ─────────────────────────────────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#0a0a18');
    bg.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc((i * 197 + 13) % W, (i * 113 + 7) % (H * 0.7), i % 3 === 0 ? 1.5 : 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Platforms ──
    for (const p of platforms) {
      ctx.fillStyle = '#3d3a6e';
      ctx.beginPath(); ctx.roundRect(p.x, p.y + 4, p.w, p.h - 4, 4); ctx.fill();
      ctx.fillStyle = '#6C63FF';
      ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, 6, 3); ctx.fill();
    }

    // ── Obstacles ──
    for (const o of obstacles) {
      // Red spiky block
      ctx.shadowColor = '#ff3333';
      ctx.shadowBlur  = 10;
      ctx.fillStyle   = '#aa1111';
      ctx.beginPath(); ctx.roundRect(o.x, o.y, o.w, o.h, 3); ctx.fill();

      // Spikes on top
      ctx.fillStyle = '#ff4444';
      const sCount = 3, sw = o.w / sCount;
      for (let s = 0; s < sCount; s++) {
        ctx.beginPath();
        ctx.moveTo(o.x + s * sw,          o.y);
        ctx.lineTo(o.x + s * sw + sw / 2, o.y - 8);
        ctx.lineTo(o.x + s * sw + sw,     o.y);
        ctx.fill();
      }

      // "!" label
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('!', o.x + o.w / 2, o.y + o.h / 2 + 1);
    }
    ctx.shadowBlur = 0;

    // ── Coins ──
    for (const c of coins) {
      if (c.collected) continue;
      const bob = Math.sin(tick * 0.05 + c.bobOffset) * 3;
      ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(c.x, c.y + bob, c.r, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD700'; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(c.x - 2, c.y + bob - 2, c.r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF176'; ctx.fill();
    }

    // ── Player (flashes while invincible) ──
    const showPlayer = player.invincible === 0 || Math.floor(tick / 5) % 2 === 0;
    if (showPlayer) {
      const { x: px, y: py, w: pw, h: ph, facing } = player;
      ctx.shadowColor = '#ff6584'; ctx.shadowBlur = 10;
      ctx.fillStyle = '#ff6584';
      ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 6); ctx.fill();
      ctx.shadowBlur = 0;
      const eyeX = facing === 1 ? px + pw - 8 : px + 6;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(eyeX, py + 10, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(eyeX + facing, py + 10, 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  // ─────────────────────────────────────────────────────────────────
  //  Game loop
  // ─────────────────────────────────────────────────────────────────
  function loop() {
    if (state !== 'playing') return;
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  // ─────────────────────────────────────────────────────────────────
  //  Overlay
  // ─────────────────────────────────────────────────────────────────
  function showOverlay(type) {
    state = type === 'win' ? 'win' : 'dead';
    cancelAnimationFrame(animId);
    draw();
    if (type === 'win') {
      overlayH2.textContent  = '🏆 You Win!';
      overlayP.textContent   = `All ${TOTAL_LEVELS} levels cleared! Final score: ${score}`;
      overlayBtn.textContent = 'Play Again';
    } else {
      overlayH2.textContent  = '💀 Game Over';
      overlayP.textContent   = `Reached Level ${currentLevel} · Score: ${score}`;
      overlayBtn.textContent = 'Try Again';
    }
    overlay.classList.remove('hidden');
  }

  function startGame() {
    score = 0; lives = 5; currentLevel = 1;
    scoreEl.textContent = score;
    livesEl.textContent = lives;
    levelEl.textContent = currentLevel;
    buildLevel(currentLevel);
    buildPlayer();
    state = 'playing';
    tick  = 0;
    overlay.classList.add('hidden');
    loop();
  }

  // ─────────────────────────────────────────────────────────────────
  //  Input — keyboard
  // ─────────────────────────────────────────────────────────────────
  document.addEventListener('keydown', e => { keys[e.key] = true;  });
  document.addEventListener('keyup',   e => { keys[e.key] = false; });

  // ─────────────────────────────────────────────────────────────────
  //  Input — mobile buttons
  // ─────────────────────────────────────────────────────────────────
  function bindMobileBtn(id, keyName) {
    const btn = document.getElementById(id);
    if (!btn) return;
    const press   = e => { e.preventDefault(); keys[keyName] = true;  btn.classList.add('pressed');    };
    const release = e => { e.preventDefault(); keys[keyName] = false; btn.classList.remove('pressed'); };
    btn.addEventListener('touchstart',  press,   { passive: false });
    btn.addEventListener('touchend',    release, { passive: false });
    btn.addEventListener('touchcancel', release, { passive: false });
    btn.addEventListener('mousedown',   press);
    btn.addEventListener('mouseup',     release);
    btn.addEventListener('mouseleave',  release);
  }

  bindMobileBtn('btn-left',  'ArrowLeft');
  bindMobileBtn('btn-right', 'ArrowRight');
  bindMobileBtn('btn-jump',  'ArrowUp');

  overlayBtn.addEventListener('click', startGame);

  // ─────────────────────────────────────────────────────────────────
  //  Boot
  // ─────────────────────────────────────────────────────────────────
  buildLevel(1);
  buildPlayer();
  draw();
  overlayH2.textContent  = "🎮 Jai's Platformer";
  overlayP.textContent   = '5 levels · collect all coins · dodge the spikes!';
  overlayBtn.textContent = 'Start Game';
  overlay.classList.remove('hidden');
});
