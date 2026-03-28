'use strict';
// ============================================================
//  SUSPECT — Social Deduction Game
//  Find the killer before it's too late!
// ============================================================

// ── Canvas dimensions ───────────────────────────────────────
const W = 1000, H = 640;

// ── Gameplay constants ──────────────────────────────────────
const PSPEED     = 3.2;    // player move speed (px/frame)
const NSPEED     = 1.7;    // NPC move speed
const KILL_R     = 58;     // max distance to kill / be killed
const WITN_R     = 165;    // witness detection radius
const REP_R      = 68;     // body report range
const BODY_R     = 115;    // NPC auto-discovers body in this range
const KILL_CD_MS = 14000;  // AI killer cooldown between kills (ms)
const P_KILL_CD  = 8000;   // player killer cooldown
const MTG_SECS   = 30;     // meeting vote timer

// ── Player names & colours (index 0 = human player) ────────
const NAMES  = ['You','RedBrick','BluBlock','GreenGuy','YelloBot','PinkPro','CyanPro'];
const COLORS = ['#4fc3f7','#e74c3c','#2ecc71','#f1c40f','#e91e8c','#00bcd4','#ff9800'];

// ── NPC wander waypoints (all inside playable area) ─────────
const WPS = [
  {x:290,y:225},{x:390,y:225},{x:500,y:225},{x:610,y:225},{x:710,y:225},
  {x:290,y:330},{x:390,y:330},{x:500,y:330},{x:610,y:330},{x:710,y:330},
  {x:290,y:430},{x:390,y:430},{x:500,y:430},{x:610,y:430},{x:710,y:430},
  {x:360,y:555},{x:500,y:555},{x:640,y:555},
  {x:400,y:80}, {x:500,y:85}, {x:600,y:80},
];

// ── State ───────────────────────────────────────────────────
let canvas, ctx, ejCanvas, ejCtx, rafId;
let scr = 'menu';
let players = [], bodies = [];
let myId = 0, killerId = -1;
let myRole = '';        // 'killer' | 'survivor'
let totalCount = 5;
let keys = {};
let joyX = 0, joyY = 0;
let itarget = null;     // { type:'kill'|'report', ref }
let pKillCD = 0;        // timestamp when player kill cooldown ends
let mtgEnd = 0, mtgReporter = '';
let mtgTimerInt = null;
let spinTO = null;
let lastTs = 0;

// ── Helpers ─────────────────────────────────────────────────
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

function randWP() {
  const w = WPS[Math.floor(Math.random() * WPS.length)];
  return { x: w.x + (Math.random() - 0.5) * 50, y: w.y + (Math.random() - 0.5) * 40 };
}

function darkColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${~~(r * 0.5)},${~~(g * 0.5)},${~~(b * 0.5)})`;
}

// Keep position inside the playable area
function clampPos(x, y) {
  x = Math.max(22, Math.min(W - 22, x));
  y = Math.max(22, Math.min(H - 22, y));
  // Block left cell block  (x < 240, y 190..470)
  if (x < 240 && y > 190 && y < 470) x = 240;
  // Block right cell block (x > 760, y 190..470)
  if (x > 760 && y > 190 && y < 470) x = 760;
  return { x, y };
}

// ── Screen management ───────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('s-' + id);
  if (el) el.classList.add('active');
  scr = id;
}

// ════════════════════════════════════════════════════════════
//  MENU
// ════════════════════════════════════════════════════════════
function pickDifficulty(n) {
  totalCount = n;
  startRoleReveal();
}

// ════════════════════════════════════════════════════════════
//  ROLE REVEAL — spinning slot machine
// ════════════════════════════════════════════════════════════
let spinDelay = 0, spinIdx = 0;
const SPIN_CYCLE = ['KILLER', 'SURVIVOR'];

function startRoleReveal() {
  showScreen('role');
  myRole = Math.random() < Math.min(1, 2 / totalCount) ? 'killer' : 'survivor';

  spinDelay = 80;
  spinIdx = 0;

  const lbl  = document.getElementById('spin-label');
  const icon = document.getElementById('role-icon');
  const desc = document.getElementById('role-desc');
  const btn  = document.getElementById('role-btn');

  lbl.textContent   = '???';
  lbl.dataset.role  = '???';
  icon.style.display = 'none';
  desc.style.display = 'none';
  btn.style.display  = 'none';

  if (spinTO) clearTimeout(spinTO);
  spinTO = setTimeout(spinTick, 400);
}

function spinTick() {
  spinIdx = (spinIdx + 1) % 2;
  const label = SPIN_CYCLE[spinIdx];
  const el = document.getElementById('spin-label');
  el.textContent  = label;
  el.dataset.role = label.toLowerCase();

  spinDelay = Math.min(spinDelay + 22, 620);

  // Stop when slow enough AND on the correct label
  const target = myRole === 'killer' ? 'KILLER' : 'SURVIVOR';
  if (spinDelay >= 500 && label === target) {
    setTimeout(showRoleResult, 350);
    return;
  }
  spinTO = setTimeout(spinTick, spinDelay);
}

function showRoleResult() {
  const icon = document.getElementById('role-icon');
  const desc = document.getElementById('role-desc');
  const btn  = document.getElementById('role-btn');

  if (myRole === 'killer') {
    icon.textContent = '🔪';
    desc.textContent = 'Kill all survivors without getting caught!';
  } else {
    icon.textContent = '❤️';
    desc.textContent = 'Find the killer and vote them out!';
  }

  icon.style.display = 'block';
  desc.style.display = 'block';
  setTimeout(() => { btn.style.display = 'inline-block'; }, 600);
}

// ════════════════════════════════════════════════════════════
//  GAME INIT
// ════════════════════════════════════════════════════════════
function beginPlay() {
  initGame();
  showScreen('playing');
  lastTs = performance.now();
  rafId = requestAnimationFrame(loop);
}

function initGame() {
  players = [];
  bodies  = [];
  pKillCD = 0;
  itarget = null;

  // Spawn all players in main corridor
  for (let i = 0; i < totalCount; i++) {
    const wp = randWP();
    players.push({
      id: i,
      name: NAMES[i],
      color: COLORS[i],
      x: 280 + i * 40,
      y: 290,
      role: 'survivor',
      alive: true,
      facing: 1,
      targetX: wp.x,
      targetY: wp.y,
      wpNextAt: 0,
      killNextAt: 0,
    });
  }

  myId     = 0;
  killerId = myRole === 'killer' ? 0 : (1 + Math.floor(Math.random() * (totalCount - 1)));
  players[killerId].role = 'killer';

  updateHUD();

  // Controls tip
  const isMobile = window.matchMedia('(max-width:820px)').matches;
  document.getElementById('hud-tip').textContent =
    isMobile ? 'Use joystick to move, tap INTERACT button' : 'WASD / Arrow keys to move · click to interact';
}

function updateHUD() {
  const me = players[myId];
  const roleLabel = !me.alive ? '💀 DEAD' : (myRole === 'killer' ? '🔪 KILLER' : '❤️ SURVIVOR');
  document.getElementById('hud-role').textContent  = roleLabel;
  document.getElementById('hud-alive').textContent = `👥 ${players.filter(p => p.alive).length} alive`;
}

// ════════════════════════════════════════════════════════════
//  GAME LOOP
// ════════════════════════════════════════════════════════════
function loop(ts) {
  if (scr !== 'playing') return;
  lastTs = ts;
  const now = ts;

  update(now);
  draw();
  updateHUD();

  rafId = requestAnimationFrame(loop);
}

function update(now) {
  movePlayer();
  updateNPCs(now);
  checkInteract(now);
  checkWinConditions();
}

// ════════════════════════════════════════════════════════════
//  PLAYER MOVEMENT
// ════════════════════════════════════════════════════════════
function movePlayer() {
  const me = players[myId];
  if (!me.alive) return;

  let dx = 0, dy = 0;
  if (keys['ArrowLeft']  || keys['a'] || keys['A']) dx -= 1;
  if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += 1;
  if (keys['ArrowUp']    || keys['w'] || keys['W']) dy -= 1;
  if (keys['ArrowDown']  || keys['s'] || keys['S']) dy += 1;

  dx += joyX;
  dy += joyY;

  const mag = Math.hypot(dx, dy);
  if (mag > 0) {
    dx /= mag; dy /= mag;
    const c = clampPos(me.x + dx * PSPEED, me.y + dy * PSPEED);
    me.x = c.x; me.y = c.y;
    if (dx !== 0) me.facing = dx > 0 ? 1 : -1;
  }
}

// ════════════════════════════════════════════════════════════
//  NPC AI
// ════════════════════════════════════════════════════════════
function updateNPCs(now) {
  for (const npc of players) {
    if (npc.id === myId || !npc.alive) continue;
    wanderNPC(npc, now);
    if (npc.id === killerId) killerAI(npc, now);
    else survivorAI(npc);
  }
}

function wanderNPC(npc, now) {
  const dx = npc.targetX - npc.x;
  const dy = npc.targetY - npc.y;
  const d  = Math.hypot(dx, dy);

  if (d < 12 || now > npc.wpNextAt) {
    const wp = randWP();
    npc.targetX  = wp.x;
    npc.targetY  = wp.y;
    npc.wpNextAt = now + 2500 + Math.random() * 1500;
  } else {
    const c = clampPos(npc.x + (dx / d) * NSPEED, npc.y + (dy / d) * NSPEED);
    npc.x = c.x; npc.y = c.y;
    if (dx !== 0) npc.facing = dx > 0 ? 1 : -1;
  }
}

function killerAI(npc, now) {
  if (now < npc.killNextAt) return;

  // Find nearest alive non-killer target
  let target = null, bestDist = Infinity;
  for (const p of players) {
    if (!p.alive || p.id === killerId) continue;
    const d = dist(npc, p);
    if (d < bestDist) { bestDist = d; target = p; }
  }
  if (!target) return;

  // Steer toward target
  npc.targetX = target.x;
  npc.targetY = target.y;

  // Check if anyone is watching (within witness range of killer OR target)
  const me = players[myId];
  let witnessed = me.alive && (dist(me, target) < WITN_R || dist(me, npc) < WITN_R);

  if (!witnessed) {
    for (const w of players) {
      if (!w.alive || w.id === killerId || w.id === target.id) continue;
      if (dist(w, target) < WITN_R || dist(w, npc) < WITN_R) { witnessed = true; break; }
    }
  }

  if (bestDist < KILL_R && !witnessed) {
    // KILL
    target.alive = false;
    bodies.push({ x: target.x, y: target.y, name: target.name, color: target.color, reported: false });
    npc.killNextAt = now + KILL_CD_MS;
    const awp = randWP();
    npc.targetX = awp.x;
    npc.targetY = awp.y;
  }
}

function survivorAI(npc) {
  // Discover unreported bodies nearby
  for (const b of bodies) {
    if (b.reported) continue;
    if (dist(npc, b) < BODY_R) {
      b.reported = true;
      // Only auto-call meeting if player is killer (else player should report it)
      if (myRole === 'killer' || !players[myId].alive) {
        setTimeout(() => triggerMeeting(`${npc.name} found a body!`), 800);
      }
      break;
    }
  }
}

// ════════════════════════════════════════════════════════════
//  INTERACTION — KILL or REPORT BODY
// ════════════════════════════════════════════════════════════
function checkInteract(now) {
  const me = players[myId];
  const prompt  = document.getElementById('btn-interact');
  const banner  = document.getElementById('spectate-banner');

  if (!me.alive) {
    banner.style.display = 'block';
    itarget = null;
    prompt.style.display = 'none';
    // Reveal killer name tag on canvas (handled in draw)
    return;
  }
  banner.style.display = 'none';

  itarget = null;

  // Killer: can kill a nearby unwitnessed survivor
  if (myRole === 'killer' && now > pKillCD) {
    for (const p of players) {
      if (!p.alive || p.id === myId) continue;
      if (dist(me, p) < KILL_R) {
        // Check witnesses
        let witnessed = false;
        for (const w of players) {
          if (!w.alive || w.id === myId || w.id === p.id) continue;
          if (dist(w, p) < WITN_R || dist(w, me) < WITN_R) { witnessed = true; break; }
        }
        if (!witnessed) {
          itarget = { type: 'kill', ref: p };
          break;
        }
      }
    }
  }

  // Survivor: can report a nearby unreported body
  if (!itarget) {
    for (const b of bodies) {
      if (b.reported) continue;
      if (dist(me, b) < REP_R) {
        itarget = { type: 'report', ref: b };
        break;
      }
    }
  }

  if (itarget) {
    prompt.style.display = 'block';
    prompt.textContent   = itarget.type === 'kill' ? '🔪 KILL' : '⚠️ REPORT';
  } else {
    prompt.style.display = 'none';
  }
}

function handleInteract() {
  if (!itarget || scr !== 'playing') return;
  const now = performance.now();

  if (itarget.type === 'kill') {
    const t = itarget.ref;
    t.alive = false;
    bodies.push({ x: t.x, y: t.y, name: t.name, color: t.color, reported: false });
    pKillCD = now + P_KILL_CD;
    itarget = null;
    document.getElementById('btn-interact').style.display = 'none';
    checkWinConditions();
  } else if (itarget.type === 'report') {
    itarget.ref.reported = true;
    itarget = null;
    triggerMeeting('You reported a body!');
  }
}

// ════════════════════════════════════════════════════════════
//  MEETING
// ════════════════════════════════════════════════════════════
function triggerMeeting(reporter) {
  if (scr !== 'playing') return;
  cancelAnimationFrame(rafId);

  mtgReporter = reporter;
  mtgEnd      = Date.now() + MTG_SECS * 1000;

  renderMeetingScreen();
  showScreen('meeting');
  startMeetingTimer();

  // If player is dead, auto-resolve after 4 seconds
  if (!players[myId].alive) {
    setTimeout(() => castVote(null), 4000);
  }
}

function renderMeetingScreen() {
  document.getElementById('mtg-reporter').textContent = mtgReporter;

  const list = document.getElementById('vote-list');
  list.innerHTML = '';

  const myAlive = players[myId].alive;

  for (const p of players) {
    const row = document.createElement('div');
    row.className = 'vote-row' + (p.alive ? '' : ' dead');

    const noobDiv = document.createElement('div');
    noobDiv.className = 'vote-noob';
    noobDiv.style.background = p.color;
    noobDiv.textContent = p.alive ? '🧍' : '💀';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'vote-name';
    nameDiv.textContent = p.id === myId ? 'You' : p.name;

    const statusDiv = document.createElement('div');
    statusDiv.className = 'vote-status';
    statusDiv.textContent = p.alive ? '' : 'Dead';

    row.appendChild(noobDiv);
    row.appendChild(nameDiv);
    row.appendChild(statusDiv);

    // Show vote button only for alive players (not self, player must be alive)
    if (p.alive && p.id !== myId && myAlive) {
      const btn = document.createElement('button');
      btn.className = 'btn-vote';
      btn.textContent = 'Vote';
      btn.onclick = () => castVote(p.id);
      row.appendChild(btn);
    }

    list.appendChild(row);
  }
}

function startMeetingTimer() {
  if (mtgTimerInt) clearInterval(mtgTimerInt);
  const bar = document.getElementById('timer-bar');
  const txt = document.getElementById('timer-txt');

  mtgTimerInt = setInterval(() => {
    const rem = Math.max(0, Math.ceil((mtgEnd - Date.now()) / 1000));
    if (txt) txt.textContent = rem;
    if (bar) bar.style.width = (rem / MTG_SECS * 100) + '%';
    if (rem <= 0) {
      clearInterval(mtgTimerInt);
      castVote(null);
    }
  }, 200);
}

function castVote(myVote) {
  if (mtgTimerInt) clearInterval(mtgTimerInt);

  // Tally votes
  const tally = {};
  players.forEach(p => { tally[p.id] = 0; });

  // Player's vote (only if alive)
  if (myVote !== null && players[myId].alive) {
    tally[myVote]++;
  }

  // AI votes
  const living = players.filter(p => p.alive);
  for (const p of players) {
    if (p.id === myId || !p.alive) continue;

    let pick = null;
    if (myRole === 'killer') {
      // 50% chance AI suspects the player (killer)
      if (Math.random() < 0.50) {
        pick = myId;
      } else {
        const others = living.filter(x => x.id !== p.id && x.id !== myId);
        if (others.length) pick = others[Math.floor(Math.random() * others.length)].id;
      }
    } else {
      // Random among living players (not self)
      const others = living.filter(x => x.id !== p.id);
      if (others.length) pick = others[Math.floor(Math.random() * others.length)].id;
    }

    if (pick !== null) tally[pick]++;
  }

  // Find highest vote (check for tie)
  let maxVotes = 0, ejId = null;
  for (const [id, v] of Object.entries(tally)) {
    if (v > maxVotes)       { maxVotes = v; ejId = parseInt(id); }
    else if (v === maxVotes) { ejId = null; } // tie
  }

  revealEjection(ejId);
}

// ════════════════════════════════════════════════════════════
//  EJECTION REVEAL
// ════════════════════════════════════════════════════════════
function revealEjection(ejId) {
  showScreen('ejected');

  const nameEl    = document.getElementById('ej-name');
  const verdictEl = document.getElementById('ej-verdict');

  if (ejId === null) {
    nameEl.textContent    = 'Nobody was ejected.';
    verdictEl.textContent = 'The vote was a tie — game continues!';
    verdictEl.className   = 'ej-verdict nobody';
    drawEjectedNoob(null, '#555');
  } else {
    const p = players[ejId];
    p.alive = false;
    const isKiller = ejId === killerId;
    const who = ejId === myId ? 'You were' : `${p.name} was`;

    nameEl.textContent    = `${ejId === myId ? 'You' : p.name} was ejected!`;
    verdictEl.textContent = isKiller
      ? `${who} the killer! ✅`
      : `${who} NOT the killer. ❌`;
    verdictEl.className   = 'ej-verdict ' + (isKiller ? 'correct' : 'wrong');

    drawEjectedNoob(p, p.color);
  }

  // Check win immediately if killer was ejected
  const isKillerEjected = ejId === killerId;

  setTimeout(() => {
    if (isKillerEjected) {
      endGame('survivors');
    } else {
      checkWinConditions();
      if (scr !== 'result') {
        showScreen('playing');
        lastTs = performance.now();
        rafId = requestAnimationFrame(loop);
      }
    }
  }, 3200);
}

function drawEjectedNoob(p, color) {
  if (!ejCtx) return;
  ejCtx.clearRect(0, 0, 120, 160);
  if (!p) {
    ejCtx.fillStyle = '#555';
    ejCtx.font = 'bold 48px sans-serif';
    ejCtx.textAlign = 'center';
    ejCtx.fillText('🤷', 60, 100);
    return;
  }
  drawNoobAt(ejCtx, 60, 110, color, false, false, false);
}

// ════════════════════════════════════════════════════════════
//  WIN CONDITIONS
// ════════════════════════════════════════════════════════════
function checkWinConditions() {
  const killerAlive = players[killerId] && players[killerId].alive;
  if (!killerAlive) { endGame('survivors'); return; }

  const aliveSurvivors = players.filter(p => p.alive && p.id !== killerId).length;
  if (aliveSurvivors === 0) { endGame('killer'); return; }
}

function endGame(winner) {
  if (scr === 'result') return;
  cancelAnimationFrame(rafId);
  showScreen('result');

  const icon  = document.getElementById('res-icon');
  const title = document.getElementById('res-title');
  const sub   = document.getElementById('res-sub');

  const iWin  = (winner === 'survivors' && myRole === 'survivor') ||
                (winner === 'killer'    && myRole === 'killer');

  icon.textContent  = winner === 'survivors' ? (iWin ? '🎉' : '💀') : (iWin ? '🔪' : '😱');
  title.textContent = iWin ? 'You Win!' : 'You Lose!';

  if (winner === 'survivors') {
    sub.textContent = iWin ? 'The killer was caught! Great detective work!' : 'The survivors caught the killer!';
  } else {
    sub.textContent = iWin ? 'You eliminated everyone without getting caught!' : 'The killer got away...';
  }
}

function goMenu() {
  showScreen('menu');
}

// ════════════════════════════════════════════════════════════
//  DRAWING
// ════════════════════════════════════════════════════════════
function draw() {
  ctx.clearRect(0, 0, W, H);
  drawMap();
  drawBodies();
  drawAllPlayers();
}

// ── Map ─────────────────────────────────────────────────────
function drawMap() {
  // Main floor
  ctx.fillStyle = '#1a1a28';
  ctx.fillRect(0, 0, W, H);

  // Subtle tile grid
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // ── Meeting room (top-centre, wider) ────────────────────
  ctx.fillStyle = '#111120';
  ctx.fillRect(340, 0, 320, 170);

  // Meeting room border
  ctx.strokeStyle = '#e63946';
  ctx.lineWidth = 2;
  ctx.strokeRect(340, 0, 320, 170);

  // Table
  ctx.fillStyle = '#242438';
  ctx.fillRect(370, 32, 260, 100);
  ctx.strokeStyle = '#3a3a55';
  ctx.lineWidth = 2;
  ctx.strokeRect(370, 32, 260, 100);

  // Chairs around table
  ctx.fillStyle = '#3a3a55';
  for (const cx of [395, 445, 500, 555, 605]) {
    ctx.beginPath(); ctx.arc(cx, 25, 9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, 140, 9, 0, Math.PI * 2); ctx.fill();
  }

  // Meeting room label
  ctx.fillStyle = '#e63946';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('[ MEETING ROOM ]', 500, 16);

  // Door indicators at bottom of meeting room
  ctx.strokeStyle = '#e63946';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(430, 170); ctx.lineTo(430, 190); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(570, 170); ctx.lineTo(570, 190); ctx.stroke();

  // ── Left cell block ─────────────────────────────────────
  ctx.fillStyle = '#0f0f1e';
  ctx.fillRect(0, 190, 240, 280);
  // Bars
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#2d2d48';
  for (let bx = 16; bx < 240; bx += 28) {
    ctx.beginPath(); ctx.moveTo(bx, 190); ctx.lineTo(bx, 470); ctx.stroke();
  }
  // Horizontal cell dividers
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, 283); ctx.lineTo(240, 283); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 376); ctx.lineTo(240, 376); ctx.stroke();
  // Cell label
  ctx.fillStyle = '#3d3d60';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CELL BLOCK A', 120, 205);

  // ── Right cell block ────────────────────────────────────
  ctx.fillStyle = '#0f0f1e';
  ctx.fillRect(760, 190, 240, 280);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#2d2d48';
  for (let bx = 772; bx < 1000; bx += 28) {
    ctx.beginPath(); ctx.moveTo(bx, 190); ctx.lineTo(bx, 470); ctx.stroke();
  }
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(760, 283); ctx.lineTo(1000, 283); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(760, 376); ctx.lineTo(1000, 376); ctx.stroke();
  ctx.fillStyle = '#3d3d60';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CELL BLOCK B', 880, 205);

  // ── Cafeteria (bottom centre, wider) ────────────────────
  ctx.fillStyle = '#161626';
  ctx.fillRect(240, 510, 520, 130);
  ctx.strokeStyle = '#2a2a40';
  ctx.lineWidth = 1;
  ctx.strokeRect(240, 510, 520, 130);
  ctx.fillStyle = '#2a2a40';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('[ CAFETERIA ]', 500, 526);
  // Cafeteria tables
  ctx.fillStyle = '#242438';
  ctx.fillRect(270, 540, 100, 60); ctx.fillRect(450, 540, 100, 60); ctx.fillRect(630, 540, 100, 60);

  // ── Corridor lines / floor detail ───────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(240, 190); ctx.lineTo(760, 190); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(240, 470); ctx.lineTo(760, 470); ctx.stroke();

  // Witness range visualiser (killer only, red tinted circles)
  if (myRole === 'killer' && players[myId] && players[myId].alive) {
    const me = players[myId];
    ctx.strokeStyle = 'rgba(230,57,70,0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(me.x, me.y, WITN_R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

// ── Bodies (dead noobs lying on the floor) ──────────────────
function drawBodies() {
  for (const b of bodies) {
    ctx.save();
    ctx.globalAlpha = b.reported ? 0.3 : 0.82;
    drawDeadNoob(ctx, b.x, b.y, b.color);

    if (!b.reported) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#f4a261';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('! BODY', b.x, b.y - 24);
    }
    ctx.restore();
  }
}

function drawDeadNoob(c, x, y, color) {
  const dc = darkColor(color);
  c.save();
  c.translate(x, y);
  c.rotate(Math.PI / 2);

  // Legs
  c.fillStyle = dc;
  c.fillRect(-8, 4, 7, 11);
  c.fillRect(1, 4, 7, 11);

  // Body
  c.fillStyle = color;
  c.fillRect(-11, -13, 22, 19);

  // Head
  c.fillStyle = '#f5cba7';
  c.fillRect(-9, -29, 18, 17);

  // X eyes
  c.strokeStyle = '#333';
  c.lineWidth = 2;
  c.beginPath(); c.moveTo(-6, -26); c.lineTo(-3, -23); c.stroke();
  c.beginPath(); c.moveTo(-3, -26); c.lineTo(-6, -23); c.stroke();
  c.beginPath(); c.moveTo(2, -26);  c.lineTo(5, -23);  c.stroke();
  c.beginPath(); c.moveTo(5, -26);  c.lineTo(2, -23);  c.stroke();

  c.restore();
}

// ── Living players ──────────────────────────────────────────
function drawAllPlayers() {
  // Draw back-to-front (painter's algorithm)
  const sorted = [...players].sort((a, b) => a.y - b.y);

  for (const p of sorted) {
    if (!p.alive) continue;

    const isYou       = p.id === myId;
    const isKiller    = p.id === killerId;
    // Reveal killer if: player is spectating, OR player IS the killer
    const showKiller  = isKiller && (!players[myId].alive || myRole === 'killer');

    // Witness ring for nearby noobs when player is killer
    if (myRole === 'killer' && !isYou && players[myId].alive) {
      const d = dist(players[myId], p);
      if (d < WITN_R) {
        ctx.strokeStyle = 'rgba(230,57,70,0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 28, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    drawNoob(p.x, p.y, p.color, p.name, p.facing, isYou, showKiller && isKiller);
  }
}

// ── Roblox-style noob character ─────────────────────────────
function drawNoob(x, y, color, name, facing, isYou, isKiller) {
  drawNoobAt(ctx, x, y, color, isYou, isKiller, facing !== -1);
  // Name label
  const label = isYou ? '★ YOU' : (isKiller ? '🔪 ' + name : name);
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';

  const tw  = ctx.measureText(label).width + 10;
  const lbg = isKiller ? 'rgba(230,57,70,0.88)' : (isYou ? 'rgba(79,195,247,0.88)' : 'rgba(0,0,0,0.70)');

  ctx.fillStyle = lbg;
  ctx.fillRect(x - tw / 2, y - 50, tw, 15);
  ctx.fillStyle = '#fff';
  ctx.fillText(label, x, y - 38);
}

function drawNoobAt(c, x, y, color, isYou, isKiller, facingRight) {
  const dc   = darkColor(color);
  const SKIN = '#f5cba7';

  // Shadow
  c.fillStyle = 'rgba(0,0,0,0.28)';
  c.beginPath();
  c.ellipse(x, y + 23, 15, 5, 0, 0, Math.PI * 2);
  c.fill();

  // Legs
  c.fillStyle = dc;
  c.fillRect(x - 10, y + 6, 8, 15);
  c.fillRect(x + 2,  y + 6, 8, 15);

  // Shoes
  c.fillStyle = '#111';
  c.fillRect(x - 11, y + 18, 10, 5);
  c.fillRect(x + 1,  y + 18, 10, 5);

  // Body (shirt)
  c.fillStyle = color;
  c.fillRect(x - 13, y - 14, 26, 22);

  // Arms
  c.fillStyle = color;
  c.fillRect(x - 19, y - 12, 7, 16);
  c.fillRect(x + 12, y - 12, 7, 16);

  // Hands
  c.fillStyle = SKIN;
  c.fillRect(x - 19, y + 2, 7, 5);
  c.fillRect(x + 12, y + 2, 7, 5);

  // Head
  c.fillStyle = SKIN;
  c.fillRect(x - 11, y - 30, 22, 18);

  // Eyes
  c.fillStyle = '#222';
  if (facingRight) {
    c.fillRect(x - 4, y - 25, 4, 4);
    c.fillRect(x + 4, y - 25, 4, 4);
  } else {
    c.fillRect(x - 8, y - 25, 4, 4);
    c.fillRect(x,     y - 25, 4, 4);
  }

  // Hair / hat
  c.fillStyle = dc;
  c.fillRect(x - 11, y - 34, 22, 7);

  // Killer knife icon on body
  if (isKiller) {
    c.font = '12px sans-serif';
    c.textAlign = 'center';
    c.fillText('🔪', x, y + 2);
  }

  // Star for player
  if (isYou) {
    c.fillStyle = '#4fc3f7';
    c.font = 'bold 10px monospace';
    c.textAlign = 'center';
    c.fillText('★', x, y - 12);
  }
}

// ════════════════════════════════════════════════════════════
//  INPUT — KEYBOARD
// ════════════════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key === 'e' || e.key === 'E') handleInteract();
});
document.addEventListener('keyup', e => { keys[e.key] = false; });

// ════════════════════════════════════════════════════════════
//  INPUT — MOBILE JOYSTICK
// ════════════════════════════════════════════════════════════
function setupJoystick() {
  const zone = document.getElementById('joystick-zone');
  const knob = document.getElementById('joystick-knob');
  const MAX  = 38;
  let sx = 0, sy = 0, active = false;

  function start(cx, cy) { sx = cx; sy = cy; active = true; }
  function move(cx, cy) {
    if (!active) return;
    let dx = cx - sx, dy = cy - sy;
    const m = Math.hypot(dx, dy);
    if (m > MAX) { dx = dx / m * MAX; dy = dy / m * MAX; }
    knob.style.transform = `translate(${dx}px,${dy}px)`;
    joyX = dx / MAX;
    joyY = dy / MAX;
  }
  function end() {
    active = false;
    joyX = joyY = 0;
    knob.style.transform = 'translate(0,0)';
  }

  zone.addEventListener('touchstart', e => { e.preventDefault(); start(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
  zone.addEventListener('touchmove',  e => { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
  zone.addEventListener('touchend',   e => { e.preventDefault(); end(); }, { passive: false });
}

// Canvas click → interact
function setupCanvasClick() {
  canvas.addEventListener('click', () => {
    if (scr === 'playing') handleInteract();
  });
}

// ════════════════════════════════════════════════════════════
//  BOOTSTRAP
// ════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  canvas   = document.getElementById('gameCanvas');
  ctx      = canvas.getContext('2d');
  ejCanvas = document.getElementById('ejectedCanvas');
  ejCtx    = ejCanvas ? ejCanvas.getContext('2d') : null;

  setupJoystick();
  setupCanvasClick();
  showScreen('menu');
});
