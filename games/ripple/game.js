'use strict';

// ═══════════════════════════════════════════════════════════════════
// LEVELS & SCENARIOS
// ═══════════════════════════════════════════════════════════════════

const LEVELS = [
  {
    title: 'Home Base',
    emoji: '🏠',
    color: '#f97316',
    timerSec: 12,
    scenarios: [
      {
        text: 'Your little sibling wants the last slice of pizza. You\'re still hungry too.',
        choices: [
          { text: '🤝 Split it in half and share', type: 'good' },
          { text: '🤷 Say you\'ll both find something else', type: 'okay' },
          { text: '🍕 Eat it quickly before they ask', type: 'bad' },
        ],
      },
      {
        text: 'Mom asks you to clean your room — but your favorite show just started.',
        choices: [
          { text: '📺 Pause the show and clean first', type: 'good' },
          { text: '⏸ Ask if you can do it right after one episode', type: 'okay' },
          { text: '🙈 Pretend you didn\'t hear', type: 'bad' },
        ],
      },
      {
        text: 'Dad is struggling with heavy grocery bags. You\'re in the middle of a game.',
        choices: [
          { text: '🛍 Pause the game and run to help', type: 'good' },
          { text: '📱 Finish your turn, then help', type: 'okay' },
          { text: '🎮 Keep playing — he can manage fine', type: 'bad' },
        ],
      },
      {
        text: 'Your sibling accidentally broke your favorite toy. They look terrified.',
        choices: [
          { text: '😊 "It\'s okay — accidents happen."', type: 'good' },
          { text: '😤 Get upset but don\'t say anything mean', type: 'okay' },
          { text: '😡 Yell at them and tell your parents immediately', type: 'bad' },
        ],
      },
      {
        text: 'It\'s your turn to do the dishes. You\'re exhausted after a long day at school.',
        choices: [
          { text: '🍽 Do them anyway without complaining', type: 'good' },
          { text: '😓 Do them while complaining loudly', type: 'okay' },
          { text: '🛑 Leave them and say you\'ll do it tomorrow', type: 'bad' },
        ],
      },
      {
        text: 'Mom had a really hard day at work. She walks in looking drained.',
        choices: [
          { text: '💝 Offer to make her tea and give her a hug', type: 'good' },
          { text: '🤫 Leave her alone quietly to rest', type: 'okay' },
          { text: '📺 Ask her to make dinner like normal', type: 'bad' },
        ],
      },
      {
        text: 'Your sibling got a noticeably bigger piece of cake than you at dessert.',
        choices: [
          { text: '😊 Let it go — it\'s just cake', type: 'good' },
          { text: '💬 Quietly point it out to an adult', type: 'okay' },
          { text: '😠 Make a big scene about it being unfair', type: 'bad' },
        ],
      },
      {
        text: 'You spilled juice on the carpet while no one was watching.',
        choices: [
          { text: '🧽 Clean it up and tell your parent what happened', type: 'good' },
          { text: '🧹 Clean it up but don\'t mention it', type: 'okay' },
          { text: '🏃 Cover it with the rug and hope no one notices', type: 'bad' },
        ],
      },
    ],
  },

  {
    title: 'School Zone',
    emoji: '🏫',
    color: '#3b82f6',
    timerSec: 11,
    scenarios: [
      {
        text: 'Your classmate is totally stuck on the problem you just solved.',
        choices: [
          { text: '📖 Explain your steps clearly', type: 'good' },
          { text: '💡 Give a small hint without the answer', type: 'okay' },
          { text: '🙅 You worked hard — they can figure it out', type: 'bad' },
        ],
      },
      {
        text: 'You bumped into someone\'s lunch tray by accident. Their food spills.',
        choices: [
          { text: '🙏 Apologize and help clean it up right away', type: 'good' },
          { text: '😬 Say sorry and quickly walk away', type: 'okay' },
          { text: '🚶 Keep walking — they didn\'t see it was you', type: 'bad' },
        ],
      },
      {
        text: 'The teacher asks who didn\'t finish their homework. You didn\'t.',
        choices: [
          { text: '✋ Raise your hand and admit it honestly', type: 'good' },
          { text: '😶 Stay very quiet and hope she doesn\'t call on you', type: 'okay' },
          { text: '📋 Quickly copy from a friend\'s worksheet', type: 'bad' },
        ],
      },
      {
        text: 'You find a $10 bill on the floor in the hallway.',
        choices: [
          { text: '🏫 Turn it in to the front office', type: 'good' },
          { text: '👀 Leave it — someone else will handle it', type: 'okay' },
          { text: '💰 Pocket it — finders keepers', type: 'bad' },
        ],
      },
      {
        text: 'Your teammate is clearly very nervous before your class presentation.',
        choices: [
          { text: '😊 Give them a calm smile and a thumbs up', type: 'good' },
          { text: '👏 Let them handle it — they\'ll be fine', type: 'okay' },
          { text: '🙄 Wish they\'d pull it together so you don\'t look bad', type: 'bad' },
        ],
      },
      {
        text: 'A kid in your class is being teased by a group of others.',
        choices: [
          { text: '🛑 Speak up clearly: "Hey, stop that."', type: 'good' },
          { text: '📣 Go find the teacher immediately', type: 'okay' },
          { text: '😶 Look away and stay completely out of it', type: 'bad' },
        ],
      },
      {
        text: 'You scored much higher on the test than your best friend. They\'re upset.',
        choices: [
          { text: '🤗 Don\'t brag — offer to study together next time', type: 'good' },
          { text: '🤐 Just stay quiet about your score', type: 'okay' },
          { text: '🏆 Tell everyone else your score', type: 'bad' },
        ],
      },
      {
        text: 'Your group project partner has done zero work. Deadline is tomorrow.',
        choices: [
          { text: '💬 Calmly talk to them about splitting it fairly', type: 'good' },
          { text: '📝 Do their part too so the project doesn\'t fail', type: 'okay' },
          { text: '😤 Go straight to the teacher to get them in trouble', type: 'bad' },
        ],
      },
    ],
  },

  {
    title: 'Friend World',
    emoji: '👫',
    color: '#ec4899',
    timerSec: 10,
    scenarios: [
      {
        text: 'Your friends are playing a game and refuse to let the new kid join.',
        choices: [
          { text: '🤝 "Come on — the more the merrier!"', type: 'good' },
          { text: '🤷 Walk away — it\'s not your game to decide', type: 'okay' },
          { text: '😏 Agree with them — more players complicates things', type: 'bad' },
        ],
      },
      {
        text: 'Your best friend tells you a secret that sounds like they might be in danger.',
        choices: [
          { text: '💬 Tell a trusted adult, even though it breaks the secret', type: 'good' },
          { text: '🤝 Promise to help them handle it yourself', type: 'okay' },
          { text: '🤐 Keep the secret — you promised', type: 'bad' },
        ],
      },
      {
        text: 'You accidentally broke something at a friend\'s house.',
        choices: [
          { text: '🙏 Tell your friend and their parent what happened', type: 'good' },
          { text: '😬 Tell your friend privately but not their parent', type: 'okay' },
          { text: '🏃 Hide it before anyone notices', type: 'bad' },
        ],
      },
      {
        text: 'Your friend has been quiet and sad for several days.',
        choices: [
          { text: '💜 Find a quiet moment to ask: "Are you okay?"', type: 'good' },
          { text: '😐 Give them space — maybe they just need time', type: 'okay' },
          { text: '🙈 Ignore it — you don\'t want an awkward conversation', type: 'bad' },
        ],
      },
      {
        text: 'All your friends start teasing someone. They look to you to join in.',
        choices: [
          { text: '🛑 Stay quiet and don\'t join — even if it\'s awkward', type: 'good' },
          { text: '😶 Laugh a little so you fit in but add nothing cruel', type: 'okay' },
          { text: '😂 Join in — you don\'t want to be the odd one out', type: 'bad' },
        ],
      },
      {
        text: 'You promised to help your friend move. Then a fun party invitation arrives.',
        choices: [
          { text: '🤝 Keep your promise and help with the move', type: 'good' },
          { text: '💬 Explain the situation and ask if another day works', type: 'okay' },
          { text: '🎉 Go to the party — your friend will understand', type: 'bad' },
        ],
      },
      {
        text: 'Your friend tells you something untrue about another person you both know.',
        choices: [
          { text: '💬 Gently say "I don\'t think that\'s true — let\'s not spread it."', type: 'good' },
          { text: '🤔 Nod along but don\'t repeat it to anyone', type: 'okay' },
          { text: '📱 Share it with just one other person', type: 'bad' },
        ],
      },
      {
        text: 'Someone new sits at your lunch table without being invited.',
        choices: [
          { text: '😊 Smile and introduce yourself', type: 'good' },
          { text: '😐 Say nothing and keep eating normally', type: 'okay' },
          { text: '😒 Tell them this table is already taken', type: 'bad' },
        ],
      },
    ],
  },

  {
    title: 'Community',
    emoji: '🌍',
    color: '#22c55e',
    timerSec: 9,
    scenarios: [
      {
        text: 'You see someone drop their wallet outside a shop.',
        choices: [
          { text: '🏃 Run after them and return it immediately', type: 'good' },
          { text: '👀 Pick it up and look around for the owner', type: 'okay' },
          { text: '💸 Open it — there\'s $20 inside. Pocket it.', type: 'bad' },
        ],
      },
      {
        text: 'There\'s trash right next to a bin — but not quite inside it.',
        choices: [
          { text: '♻️ Pick it up and put it in properly', type: 'good' },
          { text: '🤷 Walk past — you didn\'t drop it', type: 'okay' },
          { text: '🦶 Kick it further away so it\'s out of your path', type: 'bad' },
        ],
      },
      {
        text: 'An elderly person is struggling to reach something on a high shelf in a store.',
        choices: [
          { text: '🙋 Walk over and help them get it', type: 'good' },
          { text: '👀 Point it out to a nearby store worker', type: 'okay' },
          { text: '🚶 Keep walking — someone else will help', type: 'bad' },
        ],
      },
      {
        text: 'A younger kid has fallen off their bike and is crying on the path.',
        choices: [
          { text: '🩹 Go over and make sure they\'re okay', type: 'good' },
          { text: '👀 Look for a nearby adult to help them', type: 'okay' },
          { text: '🎧 You have headphones in — pretend you didn\'t see', type: 'bad' },
        ],
      },
      {
        text: 'Someone is sitting alone at the park, crying quietly.',
        choices: [
          { text: '💬 Gently ask: "Are you okay? Do you need help?"', type: 'good' },
          { text: '👀 Look for a parent or adult nearby for them', type: 'okay' },
          { text: '🎮 It\'s probably nothing — go back to what you were doing', type: 'bad' },
        ],
      },
      {
        text: 'A stray dog is loose in the neighborhood, looking lost and scared.',
        choices: [
          { text: '📞 Stay with it and try to find its owner or get help', type: 'good' },
          { text: '🐕 Walk around it carefully', type: 'okay' },
          { text: '🏃 Keep walking fast — it might bite', type: 'bad' },
        ],
      },
      {
        text: 'Someone\'s flowers in the community garden are being accidentally stepped on.',
        choices: [
          { text: '🗣 Politely point it out so they can step aside', type: 'good' },
          { text: '🌸 Step carefully around it yourself but say nothing', type: 'okay' },
          { text: '🚶 Not your concern — you\'re just passing through', type: 'bad' },
        ],
      },
      {
        text: 'At a party, a huge amount of perfectly good food is about to be thrown away.',
        choices: [
          { text: '💡 Suggest putting the extras in bags for people to take home', type: 'good' },
          { text: '🤷 Mention it to an adult and let them decide', type: 'okay' },
          { text: '🎂 Grab extra for yourself and let the rest go in the bin', type: 'bad' },
        ],
      },
    ],
  },

  {
    title: 'Hard Choices',
    emoji: '💪',
    color: '#a855f7',
    timerSec: 8,
    scenarios: [
      {
        text: 'Everyone laughs at a classmate\'s embarrassing moment. They look to you.',
        choices: [
          { text: '🛑 Don\'t laugh. Give the classmate a kind look.', type: 'good' },
          { text: '😐 Stay very quiet. Don\'t laugh, don\'t speak up.', type: 'okay' },
          { text: '😂 Laugh along — you don\'t want to seem different', type: 'bad' },
        ],
      },
      {
        text: 'You know a rumor spreading around school is completely false.',
        choices: [
          { text: '✋ Speak up and tell people it\'s not true', type: 'good' },
          { text: '🤐 Don\'t repeat it but also don\'t correct it', type: 'okay' },
          { text: '📲 Add your own detail before passing it on', type: 'bad' },
        ],
      },
      {
        text: 'Your friend is pressuring you to skip class and hang out instead.',
        choices: [
          { text: '🏫 Say no — you can hang out right after school', type: 'good' },
          { text: '😬 Say you\'ll think about it just to avoid the argument', type: 'okay' },
          { text: '🎒 Skip it — one class won\'t matter', type: 'bad' },
        ],
      },
      {
        text: 'Someone is being bullied. No adults are nearby. Everyone is watching.',
        choices: [
          { text: '🛑 Step in clearly: "Hey. Stop. That\'s not okay."', type: 'good' },
          { text: '📱 Go get an adult as fast as you can', type: 'okay' },
          { text: '🏃 Walk away — you don\'t want to become a target too', type: 'bad' },
        ],
      },
      {
        text: 'You could easily copy from the person next to you on a test. You\'re not prepared.',
        choices: [
          { text: '✏️ Do your honest best — a real grade is yours to own', type: 'good' },
          { text: '😬 Peek once but try to mostly do your own work', type: 'okay' },
          { text: '👀 Copy it — this grade matters too much', type: 'bad' },
        ],
      },
      {
        text: 'Your close friend shoplifts something small and tells you to stay quiet.',
        choices: [
          { text: '💬 Tell them it\'s wrong and encourage them to return it', type: 'good' },
          { text: '😶 Say nothing but feel very uncomfortable about it', type: 'okay' },
          { text: '🤝 Stay quiet — you don\'t want to lose the friendship', type: 'bad' },
        ],
      },
      {
        text: 'Someone posts something cruel about your classmate online.',
        choices: [
          { text: '📵 Report the post and check in on your classmate', type: 'good' },
          { text: '😶 Don\'t like or share it — just scroll past', type: 'okay' },
          { text: '😂 React with a laugh — it is kind of funny', type: 'bad' },
        ],
      },
      {
        text: 'You said something that hurt your friend\'s feelings. They don\'t know it was you.',
        choices: [
          { text: '💬 Find the courage to apologize and be honest', type: 'good' },
          { text: '😬 Act extra kind to them to silently make up for it', type: 'okay' },
          { text: '🙈 Say nothing — they\'ll get over it eventually', type: 'bad' },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════

const SAVE_KEY   = 'kindcoins_v1';
const COINS_GOOD_FAST = 15;
const COINS_GOOD      = 10;
const COINS_OKAY      =  3;
const COINS_BAD       = -5;
const COINS_TIMEOUT   = -3;
const STREAK_BONUS    = 20;
const STREAK_AT       = 3;

const FEEDBACK_MSGS = {
  good:    ['Great choice! 💚', 'That\'s real kindness! ✨', 'Well done! 🌟', 'You showed real heart! 💛', 'That\'s the one! 🎯'],
  okay:    ['Not bad... but there was a kinder way.', 'Safe choice — kindness goes a little further.', 'You could have done a bit more.'],
  bad:     ['Think about how that felt for them.', 'That one made things harder for someone.', 'We all stumble — try again!'],
  timeout: ['Too slow! Trust your instincts next time.', 'Time\'s up! Stay focused!', 'Quick — kindness can\'t wait!'],
};

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════

let save    = {};   // persisted
let session = {};   // in-memory only

// ═══════════════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════════════

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    save = raw ? JSON.parse(raw) : {};
  } catch (_) { save = {}; }

  // Defaults
  save.coins          = save.coins          ?? 0;
  save.giftName       = save.giftName       ?? '';
  save.giftTarget     = save.giftTarget     ?? 300;
  save.unlockedLevels = save.unlockedLevels ?? [0];
  save.levelStars     = save.levelStars     ?? {};
  save.goalReached    = save.goalReached    ?? false;
}

function writeSave() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

// ═══════════════════════════════════════════════════════════════════
// SCREEN MANAGER
// ═══════════════════════════════════════════════════════════════════

const SCREENS = ['home-screen', 'game-screen', 'level-complete-screen', 'redeem-screen'];

function showScreen(id) {
  SCREENS.forEach(s => {
    document.getElementById(s).classList.toggle('hidden', s !== id);
  });
}

// ═══════════════════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════════════════

function renderHome() {
  // Coin display
  document.getElementById('total-coins-display').textContent = save.coins;

  // Gift progress
  const target  = save.giftTarget;
  const pct     = Math.min(100, (save.coins / target) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = `${save.coins} / ${target} coins`;

  if (save.giftName) {
    document.getElementById('gift-name-display').textContent = '🎁 ' + save.giftName;
  } else {
    document.getElementById('gift-name-display').textContent = 'Tap ⚙️ to set your gift goal!';
  }

  // Level grid
  const grid = document.getElementById('level-grid');
  grid.innerHTML = '';
  LEVELS.forEach((level, i) => {
    const unlocked = save.unlockedLevels.includes(i);
    const stars    = save.levelStars[i] ?? 0;

    const card = document.createElement('div');
    card.className = 'level-card' + (unlocked ? '' : ' locked');
    card.style.background = unlocked
      ? `linear-gradient(135deg, ${level.color}33, ${level.color}18)`
      : 'rgba(255,255,255,0.04)';
    card.style.borderColor = unlocked ? level.color + '55' : 'transparent';

    card.innerHTML = `
      <div class="level-card-emoji">${level.emoji}</div>
      <div class="level-card-title">Level ${i + 1}: ${level.title}</div>
      <div class="level-card-sub">${level.timerSec}s per choice</div>
      <div class="level-card-stars">${starsHTML(stars)}</div>
      ${unlocked ? '' : '<div class="level-lock">🔒</div>'}
    `;

    if (unlocked) {
      card.addEventListener('click', () => startLevel(i));
    }
    grid.appendChild(card);
  });

  showScreen('home-screen');

  // If goal just reached, show redeem
  if (save.goalReached) showRedeem();
}

function starsHTML(n) {
  let s = '';
  for (let i = 0; i < 3; i++) s += (i < n ? '⭐' : '☆');
  return s;
}

// ═══════════════════════════════════════════════════════════════════
// GAME FLOW
// ═══════════════════════════════════════════════════════════════════

function startLevel(idx) {
  session = {
    levelIdx:        idx,
    roundIdx:        0,
    results:         [],   // 'good' | 'okay' | 'bad' | 'timeout' per round
    streak:          0,
    coinsThisLevel:  0,
  };

  document.getElementById('hud-level').textContent = `Lvl ${idx + 1} · ${LEVELS[idx].title}`;
  showScreen('game-screen');
  startRound();
}

function startRound() {
  const level    = LEVELS[session.levelIdx];
  const scenario = level.scenarios[session.roundIdx];
  const total    = level.scenarios.length;

  // Round info
  document.getElementById('round-info').textContent =
    `Round ${session.roundIdx + 1} of ${total}`;

  // Scenario text
  document.getElementById('scenario-text').textContent = scenario.text;

  // Choices
  const wrap = document.getElementById('choices-wrap');
  wrap.innerHTML = '';
  scenario.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.text;
    btn.addEventListener('click', () => makeChoice(i));
    wrap.appendChild(btn);
  });

  // HUD
  document.getElementById('hud-coins').textContent = save.coins;
  updateStreakHUD();

  // Feedback hidden
  document.getElementById('feedback-overlay').classList.add('hidden');

  // Start timer
  Timer.start(level.timerSec, onTimerTick, onTimerUp);
}

function makeChoice(choiceIdx) {
  Timer.stop();
  const scenario = LEVELS[session.levelIdx].scenarios[session.roundIdx];
  const choice   = scenario.choices[choiceIdx];
  const type     = choice.type;

  // Determine coins: fast bonus if > 60% time remaining
  let coins;
  if (type === 'good') {
    coins = Timer.pctRemaining() > 0.6 ? COINS_GOOD_FAST : COINS_GOOD;
  } else if (type === 'okay') {
    coins = COINS_OKAY;
  } else {
    coins = COINS_BAD;
  }

  // Streak
  if (type === 'good') {
    session.streak++;
    if (session.streak >= STREAK_AT && session.streak % STREAK_AT === 0) {
      coins += STREAK_BONUS;
    }
  } else {
    session.streak = 0;
  }

  applyCoins(coins, type);
  session.results.push(type);
  showFeedback(type, coins);
}

function onTimerUp() {
  applyCoins(COINS_TIMEOUT, 'timeout');
  session.results.push('timeout');
  session.streak = 0;
  showFeedback('timeout', COINS_TIMEOUT);
}

function applyCoins(amount, _type) {
  save.coins = Math.max(0, save.coins + amount);
  session.coinsThisLevel += amount;
  document.getElementById('hud-coins').textContent = save.coins;
  spawnCoinPop((amount >= 0 ? '+' : '') + amount, amount >= 0);
  writeSave();
}

// ─── Feedback ─────────────────────────────────────────────────────

function showFeedback(type, coins) {
  // Disable choice buttons
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);

  const overlay = document.getElementById('feedback-overlay');
  const inner   = document.getElementById('feedback-inner');
  const iconEl  = document.getElementById('feedback-icon');
  const msgEl   = document.getElementById('feedback-msg');
  const coinsEl = document.getElementById('feedback-coins');

  inner.className = type;

  const icons = { good: '✅', okay: '👍', bad: '❌', timeout: '⏰' };
  const msgs  = FEEDBACK_MSGS[type];
  iconEl.textContent  = icons[type];
  msgEl.textContent   = msgs[Math.floor(Math.random() * msgs.length)];
  coinsEl.textContent = (coins >= 0 ? '+' : '') + coins + ' coins';

  overlay.classList.remove('hidden');
  updateStreakHUD();

  setTimeout(afterFeedback, 1500);
}

function afterFeedback() {
  document.getElementById('feedback-overlay').classList.add('hidden');
  session.roundIdx++;

  const total = LEVELS[session.levelIdx].scenarios.length;
  if (session.roundIdx < total) {
    startRound();
  } else {
    endLevel();
  }
}

// ─── Streak HUD ───────────────────────────────────────────────────

function updateStreakHUD() {
  const el = document.getElementById('hud-streak');
  if (session.streak >= 2) {
    el.textContent = `🔥 ${session.streak} streak`;
  } else {
    el.textContent = '';
  }
}

// ─── End Level ────────────────────────────────────────────────────

function endLevel() {
  Timer.stop();
  const level  = LEVELS[session.levelIdx];
  const goodCount = session.results.filter(r => r === 'good').length;
  const total     = session.results.length;
  const stars     = goodCount >= 6 ? 3 : goodCount >= 4 ? 2 : 1;

  // Update save
  const prev = save.levelStars[session.levelIdx] ?? 0;
  save.levelStars[session.levelIdx] = Math.max(prev, stars);

  // Unlock next level
  const next = session.levelIdx + 1;
  if (next < LEVELS.length && !save.unlockedLevels.includes(next)) {
    save.unlockedLevels.push(next);
  }

  // Perfect level bonus
  if (goodCount === total) {
    save.coins += 50;
    session.coinsThisLevel += 50;
  }

  // Check goal
  if (!save.goalReached && save.coins >= save.giftTarget && save.giftName) {
    save.goalReached = true;
  }

  writeSave();

  // Render level complete screen
  document.getElementById('lc-emoji').textContent = level.emoji;
  document.getElementById('lc-title').textContent = `Level ${session.levelIdx + 1} Complete!`;
  document.getElementById('lc-stars').textContent  = starsHTML(stars);

  const earned = session.coinsThisLevel;
  const bonusNote = goodCount === total ? ' (+50 perfect bonus!)' : '';
  document.getElementById('lc-coins-earned').innerHTML =
    `<strong style="color:#fbbf24">+${earned} coins</strong> earned this level${bonusNote}`;

  const btns = document.getElementById('lc-buttons');
  btns.innerHTML = '';

  if (save.goalReached) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = '🎉 Claim Your Gift!';
    btn.addEventListener('click', showRedeem);
    btns.appendChild(btn);
  } else {
    if (next < LEVELS.length) {
      const nxt = document.createElement('button');
      nxt.className = 'btn';
      nxt.textContent = `Next Level →`;
      nxt.addEventListener('click', () => startLevel(next));
      btns.appendChild(nxt);
    }
    const home = document.createElement('button');
    home.className = 'btn-ghost';
    home.textContent = '← Home';
    home.addEventListener('click', () => renderHome());
    btns.appendChild(home);
  }

  showScreen('level-complete-screen');
}

// ─── Redeem ───────────────────────────────────────────────────────

function showRedeem() {
  document.getElementById('redeem-gift-name').textContent = save.giftName || 'Your Gift';
  document.getElementById('redeem-total').textContent = `Total coins earned: 🪙 ${save.coins}`;

  document.getElementById('redeem-new-btn').onclick = () => {
    save.goalReached = false;
    writeSave();
    openParentModal();
  };

  launchConfetti();
  showScreen('redeem-screen');
}

function launchConfetti() {
  const burst = document.getElementById('redeem-burst');
  burst.innerHTML = '';
  const items = ['🪙','⭐','🌟','✨','🎉','💛'];
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div');
    el.className = 'burst-coin';
    el.textContent = items[Math.floor(Math.random() * items.length)];
    el.style.left = (Math.random() * 100) + '%';
    el.style.animationDuration = (2 + Math.random() * 3) + 's';
    el.style.animationDelay    = (Math.random() * 2) + 's';
    el.style.fontSize = (1 + Math.random()) + 'rem';
    burst.appendChild(el);
  }
}

// ═══════════════════════════════════════════════════════════════════
// TIMER
// ═══════════════════════════════════════════════════════════════════

const Timer = {
  _raf: null,
  _end: 0,
  _total: 0,

  start(seconds, _onTick, onEnd) {
    this.stop();
    this._total = seconds * 1000;
    this._end   = performance.now() + this._total;
    this._onEnd = onEnd;

    const bar = document.getElementById('timer-bar');
    bar.style.transition = 'none';
    bar.style.width = '100%';

    const tick = (now) => {
      const remaining = this._end - now;
      const pct = Math.max(0, remaining / this._total);

      bar.style.width = (pct * 100) + '%';
      bar.style.background = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#eab308' : '#ef4444';

      if (pct <= 0) {
        bar.style.width = '0%';
        this._raf = null;
        onEnd();
        return;
      }
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  },

  stop() {
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
  },

  pctRemaining() {
    return Math.max(0, (this._end - performance.now()) / this._total);
  },
};

// ═══════════════════════════════════════════════════════════════════
// COIN POP ANIMATION
// ═══════════════════════════════════════════════════════════════════

function spawnCoinPop(text, positive) {
  const layer = document.getElementById('coin-pop-layer');
  const el    = document.createElement('div');
  el.className   = 'coin-pop';
  el.textContent = text;
  el.style.color = positive ? '#4ade80' : '#f87171';
  el.style.left  = (30 + Math.random() * 40) + '%';
  el.style.top   = (40 + Math.random() * 20) + '%';
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// ═══════════════════════════════════════════════════════════════════
// PARENT SETTINGS
// ═══════════════════════════════════════════════════════════════════

function openParentModal() {
  document.getElementById('gift-name-input').value   = save.giftName || '';
  document.getElementById('gift-target-input').value = save.giftTarget || 300;
  document.getElementById('parent-modal').classList.remove('hidden');
}

document.getElementById('parent-btn').addEventListener('click', openParentModal);

document.getElementById('parent-save-btn').addEventListener('click', () => {
  const name   = document.getElementById('gift-name-input').value.trim();
  const target = parseInt(document.getElementById('gift-target-input').value, 10);

  if (name)              save.giftName   = name;
  if (target >= 50)      save.giftTarget = target;
  writeSave();

  document.getElementById('parent-modal').classList.add('hidden');
  renderHome();
});

document.getElementById('parent-cancel-btn').addEventListener('click', () => {
  document.getElementById('parent-modal').classList.add('hidden');
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('Reset ALL progress and coins? This cannot be undone.')) {
    const name   = save.giftName;
    const target = save.giftTarget;
    localStorage.removeItem(SAVE_KEY);
    loadSave();
    save.giftName   = name;
    save.giftTarget = target;
    writeSave();
    document.getElementById('parent-modal').classList.add('hidden');
    renderHome();
  }
});

// Close modal on backdrop click
document.getElementById('parent-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('parent-modal')) {
    document.getElementById('parent-modal').classList.add('hidden');
  }
});

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════

loadSave();
renderHome();
