// ─── Fruit Sudoku ────────────────────────────────────────────────────────────

async function loadConfig() {
  const res = await fetch('config.json');
  return res.json();
}

loadConfig().then(cfg => {

  // ── DOM refs ──
  const screenMode    = document.getElementById('screen-mode');
  const screenGame    = document.getElementById('screen-game');
  const boardEl       = document.getElementById('board');
  const pickerEl      = document.getElementById('fruit-picker');
  const timerEl       = document.getElementById('timer');
  const infoModeEl    = document.getElementById('info-mode');
  const mistakesEl    = document.getElementById('mistakes-display');
  const winOverlay    = document.getElementById('win-overlay');
  const winMsg        = document.getElementById('win-msg');
  const spinner       = document.getElementById('spinner');

  // ── Game state ──
  let size, boxR, boxC, fruits;
  let solved, puzzle, player;
  let selectedCell = null;  // { r, c }
  let difficulty;
  let mistakes, maxMistakes;
  let timerInterval, seconds;

  // ─────────────────────────────────────────────────────────────────────────
  //  Sudoku generator
  // ─────────────────────────────────────────────────────────────────────────

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function isValid(board, r, c, val) {
    for (let i = 0; i < size; i++) {
      if (board[r][i] === val) return false;
      if (board[i][c] === val) return false;
    }
    const sr = Math.floor(r / boxR) * boxR;
    const sc = Math.floor(c / boxC) * boxC;
    for (let i = sr; i < sr + boxR; i++)
      for (let j = sc; j < sc + boxC; j++)
        if (board[i][j] === val) return false;
    return true;
  }

  // Fill a board with a valid solution using backtracking
  function fillBoard(board) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === 0) {
          for (const n of shuffle(Array.from({ length: size }, (_, i) => i + 1))) {
            if (isValid(board, r, c, n)) {
              board[r][c] = n;
              if (fillBoard(board)) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Count solutions (stops at `limit` for speed)
  function countSolutions(board, limit = 2) {
    let count = 0;
    const copy = board.map(row => [...row]);

    function solve() {
      if (count >= limit) return;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (copy[r][c] === 0) {
            for (let n = 1; n <= size; n++) {
              if (isValid(copy, r, c, n)) {
                copy[r][c] = n;
                solve();
                copy[r][c] = 0;
              }
            }
            return;
          }
        }
      }
      count++;
    }

    solve();
    return count;
  }

  // Generate puzzle: solved board + version with cells removed
  function generatePuzzle(diff) {
    const key = `${size}-${diff}`;
    const toRemove = cfg.removeCells[key] || 30;

    // Build solved board
    const solvedBoard = Array(size).fill(null).map(() => Array(size).fill(0));
    fillBoard(solvedBoard);

    // Remove cells one by one, keeping unique solution
    const puzzleBoard = solvedBoard.map(row => [...row]);
    const positions = shuffle(
      Array.from({ length: size * size }, (_, i) => [Math.floor(i / size), i % size])
    );

    let removed = 0;
    for (const [r, c] of positions) {
      if (removed >= toRemove) break;
      const backup = puzzleBoard[r][c];
      puzzleBoard[r][c] = 0;
      if (countSolutions(puzzleBoard) === 1) {
        removed++;
      } else {
        puzzleBoard[r][c] = backup;
      }
    }

    return { solved: solvedBoard, puzzle: puzzleBoard };
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  Game flow
  // ─────────────────────────────────────────────────────────────────────────

  function startGame(sz, diff) {
    size       = sz;
    difficulty = diff;
    boxR = (sz === 6) ? 2 : 3;
    boxC = (sz === 6) ? 3 : 3;
    fruits     = (sz === 6) ? cfg.fruits6 : cfg.fruits9;
    mistakes   = 0;
    maxMistakes = 5;
    selectedCell = null;

    // Show spinner while generating (can take a moment for 9x9 hard)
    spinner.classList.remove('hidden');

    // Yield to browser so spinner renders, then generate
    setTimeout(() => {
      const result = generatePuzzle(diff);
      solved = result.solved;
      puzzle = result.puzzle;
      player = puzzle.map(row => [...row]);

      spinner.classList.add('hidden');

      // Update status
      const diffLabel = diff.charAt(0).toUpperCase() + diff.slice(1);
      infoModeEl.textContent    = `${sz}×${sz} · ${diffLabel}`;
      mistakesEl.textContent    = `❌ 0 / ${maxMistakes}`;

      // Timer
      clearInterval(timerInterval);
      seconds = 0;
      timerEl.textContent = '00:00';
      timerInterval = setInterval(() => {
        seconds++;
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
      }, 1000);

      screenMode.classList.add('hidden');
      screenGame.classList.remove('hidden');

      renderBoard();
      renderPicker();
    }, 50);
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  Board rendering
  // ─────────────────────────────────────────────────────────────────────────

  function getConflicts() {
    const bad = new Set();
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const v = player[r][c];
        if (!v) continue;
        // Row
        for (let i = 0; i < size; i++) {
          if (i !== c && player[r][i] === v) { bad.add(`${r},${c}`); bad.add(`${r},${i}`); }
        }
        // Col
        for (let i = 0; i < size; i++) {
          if (i !== r && player[i][c] === v) { bad.add(`${r},${c}`); bad.add(`${i},${c}`); }
        }
        // Box
        const sr = Math.floor(r / boxR) * boxR, sc = Math.floor(c / boxC) * boxC;
        for (let i = sr; i < sr + boxR; i++)
          for (let j = sc; j < sc + boxC; j++)
            if ((i !== r || j !== c) && player[i][j] === v) {
              bad.add(`${r},${c}`); bad.add(`${i},${j}`);
            }
      }
    }
    return bad;
  }

  function renderBoard() {
    const conflicts = getConflicts();
    boardEl.className = `board size-${size}`;
    boardEl.innerHTML = '';

    const selR = selectedCell?.r, selC = selectedCell?.c;
    const selVal = selectedCell ? player[selR][selC] : 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';

        const val     = player[r][c];
        const isGiven = puzzle[r][c] !== 0;
        const isSel   = r === selR && c === selC;

        // Highlight — same row, col, or box as selected
        let highlight = false;
        if (selectedCell) {
          const sameBR = Math.floor(r / boxR) === Math.floor(selR / boxR);
          const sameBC = Math.floor(c / boxC) === Math.floor(selC / boxC);
          highlight = (r === selR || c === selC || (sameBR && sameBC));
        }

        if (isGiven)   cell.classList.add('given');
        if (isSel)     cell.classList.add('selected');
        else if (highlight) cell.classList.add('highlighted');
        if (val && val === selVal && !isSel) cell.classList.add('same-val');
        if (conflicts.has(`${r},${c}`)) cell.classList.add('conflict');

        // Thick box borders
        const boxEndR = (Math.floor(r / boxR) + 1) * boxR - 1;
        const boxEndC = (Math.floor(c / boxC) + 1) * boxC - 1;
        if (r === boxEndR && r < size - 1) cell.classList.add('box-border-bottom');
        if (c === boxEndC && c < size - 1) cell.classList.add('box-border-right');

        if (val) cell.textContent = fruits[val - 1];

        cell.addEventListener('click', () => {
          selectedCell = { r, c };
          renderBoard();
        });

        boardEl.appendChild(cell);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  Fruit picker rendering
  // ─────────────────────────────────────────────────────────────────────────

  function renderPicker() {
    pickerEl.innerHTML = '';

    // Count how many of each fruit are already placed
    const placed = Array(size + 1).fill(0);
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        if (player[r][c]) placed[player[r][c]]++;

    fruits.forEach((fruit, i) => {
      const val   = i + 1;
      const count = size - placed[val];   // remaining to place
      const btn   = document.createElement('button');
      btn.className = 'fruit-btn';
      if (count === 0) btn.classList.add('done');

      btn.innerHTML = `${fruit}<span class="count">${count}</span>`;
      btn.addEventListener('click', () => placeFruit(val));
      pickerEl.appendChild(btn);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  Place / erase
  // ─────────────────────────────────────────────────────────────────────────

  function placeFruit(val) {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (puzzle[r][c] !== 0) return;   // given cell — can't change

    const prev = player[r][c];
    if (prev === val) return;         // same fruit — no-op

    player[r][c] = val;

    // Wrong answer?
    if (val !== solved[r][c]) {
      mistakes++;
      mistakesEl.textContent = `❌ ${mistakes} / ${maxMistakes}`;
      if (mistakes >= maxMistakes) {
        clearInterval(timerInterval);
        revealBoard();
        setTimeout(() => {
          winMsg.textContent = 'Better luck next time!';
          document.querySelector('.win-emoji').textContent = '😓';
          document.querySelector('.win-box h2').textContent = 'Game Over';
          winOverlay.classList.remove('hidden');
        }, 400);
        return;
      }
    }

    renderBoard();
    renderPicker();
    checkWin();
  }

  function eraseCell() {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (puzzle[r][c] !== 0) return;
    player[r][c] = 0;
    renderBoard();
    renderPicker();
  }

  // Reveal correct answers (on game over)
  function revealBoard() {
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        player[r][c] = solved[r][c];
    renderBoard();
  }

  function checkWin() {
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        if (player[r][c] !== solved[r][c]) return;

    clearInterval(timerInterval);
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    const mistakeWord = mistakes === 1 ? 'mistake' : 'mistakes';

    setTimeout(() => {
      document.querySelector('.win-emoji').textContent = '🎉';
      document.querySelector('.win-box h2').textContent = 'Puzzle Solved!';
      winMsg.textContent = `Time: ${m}:${s}  ·  ${mistakes} ${mistakeWord}`;
      winOverlay.classList.remove('hidden');
    }, 300);
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  Event listeners
  // ─────────────────────────────────────────────────────────────────────────

  // Mode selection
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      startGame(parseInt(btn.dataset.size), btn.dataset.diff);
    });
  });

  // Back to mode screen
  document.getElementById('btn-back').addEventListener('click', () => {
    clearInterval(timerInterval);
    screenGame.classList.add('hidden');
    screenMode.classList.remove('hidden');
  });

  // New game (same size + difficulty)
  document.getElementById('btn-new').addEventListener('click', () => {
    startGame(size, difficulty);
  });

  // Erase button
  document.getElementById('btn-erase').addEventListener('click', eraseCell);

  // Keyboard: number/letter shortcuts + arrow keys + backspace
  document.addEventListener('keydown', e => {
    if (!selectedCell || screenGame.classList.contains('hidden')) return;

    const { r, c } = selectedCell;

    if (e.key === 'Backspace' || e.key === 'Delete') { eraseCell(); return; }

    // Arrow key navigation
    const moves = { ArrowUp: [-1,0], ArrowDown: [1,0], ArrowLeft: [0,-1], ArrowRight: [0,1] };
    if (moves[e.key]) {
      const [dr, dc] = moves[e.key];
      const nr = Math.max(0, Math.min(size - 1, r + dr));
      const nc = Math.max(0, Math.min(size - 1, c + dc));
      selectedCell = { r: nr, c: nc };
      renderBoard();
      return;
    }

    // Number keys 1–9
    const n = parseInt(e.key);
    if (n >= 1 && n <= size) placeFruit(n);
  });

  // Win overlay buttons
  document.getElementById('win-again').addEventListener('click', () => {
    winOverlay.classList.add('hidden');
    startGame(size, difficulty);
  });

  document.getElementById('win-home').addEventListener('click', () => {
    winOverlay.classList.add('hidden');
    clearInterval(timerInterval);
    screenGame.classList.add('hidden');
    screenMode.classList.remove('hidden');
  });

});
