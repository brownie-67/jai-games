'use strict';

// ── Story Data ────────────────────────────────────────────────────────────────

const SCENES = [
  // ── Scene 0: The Fallen Books ──────────────────────────────────────────────
  {
    id: 'books',
    bgClass: 'scene-hallway',
    location: '🏫  School Hallway · First Day',
    chars: [
      { emoji: '👧🏻', label: 'Mia', xPct: 62, yPct: 30, id: 'mia' },
      { emoji: '📚', label: '', xPct: 58, yPct: 65, id: 'books', size: '2.8rem' },
    ],
    dialog: [
      { speaker: null, text: 'The hallway is loud and crowded. Today is the very first day of school.' },
      { speaker: null, text: 'Suddenly — CRASH. A girl trips and her backpack spills open. Books and papers scatter everywhere!' },
      { speaker: 'Mia', charId: 'mia', text: '"Oh no, oh no..." She scrambles to collect everything, face turning red.' },
      { speaker: null, text: 'Everyone else keeps walking. She glances up and notices you watching.' },
    ],
    choicePrompt: 'What do you do?',
    choices: [
      { text: '🤝  Stop and help her pick everything up', karma: 2, tag: 'helped_mia', key: 'kind' },
      { text: '🚶  Keep walking — you\'ll be late to class', karma: 0, tag: null, key: 'neutral' },
      { text: '😂  Nudge your friend and laugh at her', karma: -2, tag: 'hurt_mia', key: 'unkind' },
    ],
    reactions: {
      kind: [
        { speaker: 'Mia', charId: 'mia', text: '"Thank you SO much! I was so nervous today. I\'m Mia!"' },
        { speaker: null, text: 'Her whole face lights up. You made a new friend on the very first day.' },
      ],
      neutral: [
        { speaker: null, text: 'She picks up her books alone, glancing around hopefully.' },
        { speaker: null, text: 'She manages. But the hallway felt very big and empty today.' },
      ],
      unkind: [
        { speaker: 'Mia', charId: 'mia', text: '"..." Her cheeks go red. She stares at the floor and doesn\'t say a word.' },
        { speaker: null, text: 'The laughter rings in her ears all morning. You forgot. She didn\'t.' },
      ],
    },
  },

  // ── Scene 1: The Empty Table ───────────────────────────────────────────────
  {
    id: 'table',
    bgClass: 'scene-cafeteria',
    location: '🍽️  School Cafeteria · Lunchtime',
    chars: [
      { emoji: '🧒🏽', label: 'Sam', xPct: 50, yPct: 28, id: 'sam' },
      { emoji: '🥪', label: '', xPct: 50, yPct: 65, id: 'lunch', size: '2rem' },
    ],
    dialog: [
      { speaker: null, text: 'Lunchtime. The cafeteria is noisy and full of laughter.' },
      { speaker: null, text: 'In the far corner, a boy named Sam sits completely alone. He\'s been eating alone every single day.' },
      { speaker: 'Sam', charId: 'sam', text: 'He looks up for a second, then quickly back down at his sandwich.' },
      { speaker: null, text: 'Your table has an empty seat. Your friends are joking around and haven\'t noticed Sam.' },
    ],
    choicePrompt: 'What do you do?',
    choices: [
      { text: '😊  Walk over and invite Sam to sit with you', karma: 2, tag: 'included_sam', key: 'kind' },
      { text: '🤷  Stay with your friends — it\'s not really your problem', karma: 0, tag: null, key: 'neutral' },
      { text: '😒  Join your friends who are quietly making fun of him', karma: -2, tag: 'excluded_sam', key: 'unkind' },
    ],
    reactions: {
      kind: [
        { speaker: 'Sam', charId: 'sam', text: '"...Really? You sure?" He can barely believe it.' },
        { speaker: null, text: 'Sam sits with you. He\'s actually really funny. You wonder why you didn\'t do this sooner.' },
      ],
      neutral: [
        { speaker: null, text: 'Sam finishes his lunch alone. Another hour where no one noticed.' },
        { speaker: null, text: 'You\'re laughing with your friends. Sam counts the minutes until the bell rings.' },
      ],
      unkind: [
        { speaker: 'Sam', charId: 'sam', text: 'He hears the snickering. He stops eating and stares at his tray.' },
        { speaker: null, text: 'Sam throws away most of his lunch. He wasn\'t very hungry anyway.' },
      ],
    },
  },

  // ── Scene 2: The Rumor ─────────────────────────────────────────────────────
  {
    id: 'rumor',
    bgClass: 'scene-yard',
    location: '🏃  School Yard · After Lunch',
    chars: [
      { emoji: '👦🏼', label: 'Riley', xPct: 60, yPct: 28, id: 'riley' },
      { emoji: '📱', label: '', xPct: 30, yPct: 60, id: 'phone', size: '2.4rem' },
    ],
    dialog: [
      { speaker: null, text: 'A rumor is spreading — something mean and totally untrue about Riley.' },
      { speaker: null, text: 'You know it\'s not true. You can see the messages piling up in the group chat.' },
      { speaker: 'Friend', charId: null, text: '"Did you see what everyone\'s saying about Riley? Wild, right?" Your friend holds up their phone.' },
      { speaker: null, text: 'Riley is just across the yard. He hasn\'t seen it yet. You have a choice to make right now.' },
    ],
    choicePrompt: 'What do you do?',
    choices: [
      { text: '✋  Speak up: "That\'s not true. Everyone needs to stop."', karma: 2, tag: 'defended_riley', key: 'kind' },
      { text: '😶  Stay quiet — you don\'t want to get involved', karma: -1, tag: null, key: 'neutral' },
      { text: '📲  Share it — everyone else already has', karma: -2, tag: 'spread_rumor', key: 'unkind' },
    ],
    reactions: {
      kind: [
        { speaker: 'Riley', charId: 'riley', text: '"You stopped it? I... honestly, thank you. You didn\'t have to do that."' },
        { speaker: null, text: 'The rumor slows down. It took real courage to say something. Riley won\'t forget it.' },
      ],
      neutral: [
        { speaker: null, text: 'The rumor spreads all afternoon. Riley finds out by end of the day.' },
        { speaker: 'Riley', charId: 'riley', text: '"Nobody said anything?" He stares at his phone, looking lost.' },
      ],
      unkind: [
        { speaker: null, text: 'You share it. It spreads everywhere. Riley finds out you were part of it.' },
        { speaker: 'Riley', charId: 'riley', text: '"I thought you were different." He doesn\'t talk to you for a week.' },
      ],
    },
  },

  // ── Scene 3: The Kitten in the Rain ───────────────────────────────────────
  {
    id: 'rain',
    bgClass: 'scene-rain',
    rain: true,
    location: '🌧️  Street Corner · Rainy Afternoon',
    chars: [
      { emoji: '🐱', label: '', xPct: 38, yPct: 25, id: 'cat' },
      { emoji: '👵🏼', label: 'Mrs. Chen', xPct: 65, yPct: 35, id: 'chen' },
    ],
    dialog: [
      { speaker: null, text: 'It\'s pouring rain and you\'re rushing home.' },
      { speaker: null, text: 'You hear a tiny cry — a kitten is stuck behind a fence, soaked and shivering.' },
      { speaker: 'Mrs. Chen', charId: 'chen', text: '"Oh dear! I\'ve been trying to reach her for an hour. My hands just can\'t do it anymore..."' },
      { speaker: null, text: 'You\'d have to reach through the gap — you\'d absolutely get drenched. But the kitten looks terrified.' },
    ],
    choicePrompt: 'What do you do?',
    choices: [
      { text: '🌧️  Get wet and gently free the kitten', karma: 2, tag: 'helped_chen', key: 'kind' },
      { text: '🏃  Say you\'ll get someone to help... and keep walking', karma: -1, tag: null, key: 'neutral' },
      { text: '🙅  You\'ll ruin your jacket. Not your problem.', karma: -2, tag: null, key: 'unkind' },
    ],
    reactions: {
      kind: [
        { speaker: 'Mrs. Chen', charId: 'chen', text: '"Oh, bless you! Here — please take my umbrella. You\'ll need it far more than I do!"' },
        { speaker: null, text: 'The kitten purrs in Mrs. Chen\'s arms. You walk home soaked but somehow very warm inside.' },
      ],
      neutral: [
        { speaker: null, text: 'You don\'t come back. The kitten is freed much later, still shivering.' },
        { speaker: null, text: 'It was easier not to think about it. But you thought about it the whole walk home.' },
      ],
      unkind: [
        { speaker: null, text: 'You leave. Behind you, the kitten\'s small cry fades in the rain.' },
        { speaker: null, text: 'You stayed dry. But somehow the walk home doesn\'t feel very warm.' },
      ],
    },
  },
];

// ── Epilogue Callbacks ─────────────────────────────────────────────────────

const CALLBACKS = {
  helped_mia: {
    emoji: '👧🏻',
    text: '<strong>Mia</strong> saw you drop your things in the hallway. Without hesitating, she rushed over to help — just like you helped her on that first day.',
  },
  included_sam: {
    emoji: '🧒🏽',
    text: '<strong>Sam</strong> saved you a seat at lunch when you couldn\'t find your friends. He even shared his snacks. "You were the first person who was ever nice to me," he said.',
  },
  defended_riley: {
    emoji: '👦🏼',
    text: '<strong>Riley</strong> heard someone starting a rumor about YOU. He stood up immediately: "That\'s not true. Stop spreading it." He didn\'t even hesitate.',
  },
  helped_chen: {
    emoji: '👵🏼',
    text: '<strong>Mrs. Chen</strong> spotted you caught in the rain without an umbrella. She walked over and insisted you take hers. "Kindness finds its way back," she smiled.',
  },
};

// ── Endings ────────────────────────────────────────────────────────────────

const ENDINGS = {
  warm: {
    emoji: '🌟',
    title: 'The Warm Ripple',
    message: 'The kindness you sent into the world came back to you.\n\nThe people you helped remembered — and they showed up.\n\nThat\'s the power of ripples. They travel farther than you think. They reach people you\'ve long forgotten. And one day, they find their way home.',
  },
  mixed: {
    emoji: '🌊',
    title: 'Still Growing',
    message: 'Some of your ripples were warm — and they found their way back.\nOthers faded in the cold.\n\nThat\'s okay. No one is perfect. Every single day is a new chance to choose.\n\nWhat kind of ripples will you make tomorrow?',
  },
  cold: {
    emoji: '❄️',
    title: 'The Cold Ripple',
    message: 'When you needed someone... the world felt quiet.\n\nNot because people are unkind. But because the ripples we put out shape the world around us.\n\nThe best part? Every single moment is a fresh start. Tomorrow, you can choose differently.',
  },
};

// ── State ─────────────────────────────────────────────────────────────────────

let sceneIndex   = 0;
let dialogIndex  = 0;
let phase        = 'idle';   // 'dialog' | 'choice' | 'reaction' | 'end'
let chosenKey    = null;
let karmaScore   = 0;
let playerTags   = [];
let reactionLines = [];
let rainDrops    = [];

// ── DOM refs ──────────────────────────────────────────────────────────────────

const startScreen   = document.getElementById('start-screen');
const startBtn      = document.getElementById('start-btn');
const gameEl        = document.getElementById('game');
const endScreen     = document.getElementById('end-screen');
const meterFill     = document.getElementById('meter-fill');
const meterGlow     = document.getElementById('meter-glow');
const sceneArea     = document.getElementById('scene-area');
const sceneBg       = document.getElementById('scene-bg');
const rainLayer     = document.getElementById('rain-layer');
const locationBadge = document.getElementById('location-badge');
const sceneChars    = document.getElementById('scene-chars');
const rippleLayer   = document.getElementById('ripple-layer');
const dialogBox     = document.getElementById('dialog-box');
const speakerLabel  = document.getElementById('speaker-label');
const dialogText    = document.getElementById('dialog-text');
const nextBtn       = document.getElementById('next-btn');
const choiceBox     = document.getElementById('choice-box');
const choicePrompt  = document.getElementById('choice-prompt');
const choiceList    = document.getElementById('choice-list');

// ── Boot ─────────────────────────────────────────────────────────────────────

startBtn.addEventListener('click', () => {
  startScreen.style.opacity = '0';
  startScreen.style.transition = 'opacity 0.6s ease';
  setTimeout(() => {
    startScreen.style.display = 'none';
    gameEl.classList.remove('hidden');
    beginScene(0);
  }, 600);
});

document.getElementById('play-again-btn').addEventListener('click', () => {
  location.reload();
});

// ── Scene Management ──────────────────────────────────────────────────────────

function beginScene(index) {
  sceneIndex  = index;
  dialogIndex = 0;
  phase       = 'dialog';

  const scene = SCENES[index];

  // Background
  sceneBg.className = '';
  sceneBg.classList.add(scene.bgClass);
  sceneBg.style.position = 'absolute';
  sceneBg.style.inset = '0';

  // Location badge
  locationBadge.textContent = scene.location;

  // Rain
  clearRain();
  if (scene.rain) spawnRain();

  // Characters
  renderChars(scene.chars);

  // Dialog
  choiceBox.classList.add('hidden');
  dialogBox.classList.remove('hidden');
  showLine(scene.dialog[0]);
}

function showLine(line) {
  if (line.speaker) {
    speakerLabel.textContent = line.speaker;
    // Highlight speaking character
    if (line.charId) {
      document.querySelectorAll('.char-figure').forEach(el => {
        el.classList.toggle('speaking', el.dataset.id === line.charId);
      });
    }
  } else {
    speakerLabel.textContent = '';
    document.querySelectorAll('.char-figure').forEach(el => el.classList.remove('speaking'));
  }
  animateText(line.text);
}

function animateText(text) {
  dialogText.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    dialogText.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 22);
}

nextBtn.addEventListener('click', advance);
// Tap anywhere on dialog box (not next button) also advances
dialogBox.addEventListener('click', (e) => {
  if (e.target !== nextBtn) advance();
});

function advance() {
  if (phase === 'dialog') {
    const scene = SCENES[sceneIndex];
    dialogIndex++;
    if (dialogIndex < scene.dialog.length) {
      showLine(scene.dialog[dialogIndex]);
    } else {
      showChoices(scene);
    }
  } else if (phase === 'reaction') {
    dialogIndex++;
    if (dialogIndex < reactionLines.length) {
      showLine(reactionLines[dialogIndex]);
    } else {
      nextScene();
    }
  }
}

// ── Choices ───────────────────────────────────────────────────────────────────

function showChoices(scene) {
  phase = 'choice';
  dialogBox.classList.add('hidden');
  choiceBox.classList.remove('hidden');
  choicePrompt.textContent = scene.choicePrompt;

  choiceList.innerHTML = '';
  scene.choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.text;
    btn.addEventListener('click', () => makeChoice(choice));
    choiceList.appendChild(btn);
  });
}

function makeChoice(choice) {
  // Disable all choice buttons
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

  // Record
  karmaScore += choice.karma;
  if (choice.tag) playerTags.push(choice.tag);
  chosenKey = choice.key;

  // Update meter
  updateMeter();

  // Spawn ripple at main character position
  const mainChar = SCENES[sceneIndex].chars[0];
  spawnRipple(mainChar.xPct, mainChar.yPct, choice.karma);

  // After short pause, show reaction
  setTimeout(() => {
    choiceBox.classList.add('hidden');
    dialogBox.classList.remove('hidden');
    reactionLines = SCENES[sceneIndex].reactions[chosenKey];
    dialogIndex   = 0;
    phase         = 'reaction';
    showLine(reactionLines[0]);
  }, 900);
}

// ── Scene Transition ──────────────────────────────────────────────────────────

function nextScene() {
  sceneIndex++;
  if (sceneIndex < SCENES.length) {
    // Fade transition
    sceneArea.style.opacity = '0';
    sceneArea.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
      beginScene(sceneIndex);
      sceneArea.style.opacity = '1';
    }, 400);
  } else {
    showEpilogue();
  }
}

// ── Epilogue ──────────────────────────────────────────────────────────────────

function showEpilogue() {
  // Determine ending
  let endingKey;
  if (karmaScore >= 5)      endingKey = 'warm';
  else if (karmaScore >= 0) endingKey = 'mixed';
  else                      endingKey = 'cold';

  const ending = ENDINGS[endingKey];

  // Collect callbacks the player earned
  const earned = playerTags
    .filter(tag => CALLBACKS[tag])
    .map(tag => CALLBACKS[tag]);

  // Populate end screen
  document.getElementById('end-emoji-big').textContent = ending.emoji;
  document.getElementById('end-title').textContent     = ending.title;
  document.getElementById('end-message').textContent   = ending.message;

  const callbacksEl = document.getElementById('end-callbacks');
  callbacksEl.innerHTML = '';

  if (earned.length > 0) {
    earned.forEach((cb, i) => {
      const card = document.createElement('div');
      card.className = 'callback-card';
      card.style.animationDelay = `${i * 0.15 + 0.3}s`;
      card.innerHTML = `
        <span class="callback-emoji">${cb.emoji}</span>
        <span class="callback-text">${cb.text}</span>
      `;
      callbacksEl.appendChild(card);
    });
  } else {
    const card = document.createElement('div');
    card.className = 'callback-card';
    card.style.animationDelay = '0.3s';
    card.innerHTML = `
      <span class="callback-emoji">🌱</span>
      <span class="callback-text">No one stepped forward this time. But kindness is a skill — and every day is a chance to practice it.</span>
    `;
    callbacksEl.appendChild(card);
  }

  // Show end screen with ripple animation
  gameEl.classList.add('hidden');
  endScreen.classList.remove('hidden');
  spawnEndRipples(endingKey);
}

// ── Visual Helpers ────────────────────────────────────────────────────────────

function renderChars(chars) {
  sceneChars.innerHTML = '';
  chars.forEach(ch => {
    const fig = document.createElement('div');
    fig.className = 'char-figure';
    fig.dataset.id = ch.id;
    fig.style.left   = ch.xPct + '%';
    fig.style.top    = ch.yPct + '%';

    const emojiEl = document.createElement('div');
    emojiEl.className = 'char-emoji';
    emojiEl.style.fontSize = ch.size || '4rem';
    emojiEl.textContent = ch.emoji;

    fig.appendChild(emojiEl);

    if (ch.label) {
      const lbl = document.createElement('div');
      lbl.className = 'char-label';
      lbl.textContent = ch.label;
      fig.appendChild(lbl);
    }

    sceneChars.appendChild(fig);
  });
}

function spawnRipple(xPct, yPct, karma) {
  // Color based on karma
  let color, delay;
  if (karma > 0)      color = ['#FFD700', '#FFC947', '#FFAA00'];
  else if (karma < 0) color = ['#667799', '#556688', '#445577'];
  else                color = ['#88aacc', '#779ac0', '#6688aa'];

  [0, 280, 560].forEach((delayMs, i) => {
    const ring = document.createElement('div');
    ring.className = 'ripple-ring';
    ring.style.width       = '60px';
    ring.style.height      = '60px';
    ring.style.left        = xPct + '%';
    ring.style.top         = yPct + '%';
    ring.style.borderColor = color[i] || color[0];
    ring.style.animationDelay = delayMs + 'ms';
    ring.style.animationDuration = '1.1s';
    rippleLayer.appendChild(ring);
    setTimeout(() => ring.remove(), delayMs + 1200);
  });
}

function updateMeter() {
  // karmaScore range: -8 to +8 (4 scenes × max 2)
  const MIN = -8, MAX = 8;
  const pct = ((karmaScore - MIN) / (MAX - MIN)) * 100;
  const clamped = Math.max(2, Math.min(98, pct));

  meterFill.style.width = clamped + '%';
  meterGlow.style.left  = clamped + '%';

  // Color shift warm → cool
  if (karmaScore >= 3) {
    meterFill.style.background = 'linear-gradient(90deg, #e8a020, #FFD700)';
    meterGlow.style.background = '#FFD700';
    meterGlow.style.boxShadow  = '0 0 10px 3px rgba(255, 215, 0, 0.6)';
  } else if (karmaScore >= 0) {
    meterFill.style.background = 'linear-gradient(90deg, #4a7abf, #6c63ff)';
    meterGlow.style.background = '#6c63ff';
    meterGlow.style.boxShadow  = '0 0 10px 3px rgba(108, 99, 255, 0.5)';
  } else {
    meterFill.style.background = 'linear-gradient(90deg, #334455, #556677)';
    meterGlow.style.background = '#556677';
    meterGlow.style.boxShadow  = '0 0 6px 2px rgba(85, 102, 119, 0.4)';
  }
}

// ── Rain ───────────────────────────────────────────────────────────────────────

function spawnRain() {
  for (let i = 0; i < 35; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    const h = 8 + Math.random() * 14;
    drop.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      height: ${h}px;
      animation-duration: ${0.5 + Math.random() * 0.4}s;
      animation-delay:    ${Math.random() * 1}s;
      opacity: ${0.3 + Math.random() * 0.4};
    `;
    rainLayer.appendChild(drop);
    rainDrops.push(drop);
  }
}

function clearRain() {
  rainDrops.forEach(d => d.remove());
  rainDrops = [];
}

// ── End Screen Ripple Animation ───────────────────────────────────────────────

function spawnEndRipples(endingKey) {
  const canvas = document.getElementById('end-ripples-canvas');
  const colors = endingKey === 'warm'
    ? ['#FFD700', '#FFC947', '#ffaa00', '#fbbf24']
    : endingKey === 'mixed'
    ? ['#7dd3fc', '#818cf8', '#a78bfa']
    : ['#667799', '#445566', '#334455'];

  canvas.innerHTML = '';
  colors.forEach((color, i) => {
    const ring = document.createElement('div');
    ring.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      border-radius: 50%;
      border: 2px solid ${color};
      width: 40px; height: 40px;
      transform: translate(-50%, -50%);
      animation: rippleExpand 2.5s ease-out ${i * 0.5}s infinite;
    `;
    canvas.appendChild(ring);
  });
}
