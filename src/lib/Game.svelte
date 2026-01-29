<script lang="ts">
  import { onMount } from 'svelte';
  import type { Color, GuessResult } from '../utils/logic';
  import { COLOR_HEX, shuffleTarget, computeMatches } from '../utils/logic';
  import Palette from './Palette.svelte';
  import History from './History.svelte';
  import Modal from './Modal.svelte';
  import Instructions from './Instructions.svelte';

  const MAX_ATTEMPTS = 7;

  let target: Color[] = [];
  let currentGuess: (Color | null)[] = [null, null, null, null];
  let guesses: GuessResult[] = [];
  let status: 'playing' | 'won' | 'lost' = 'playing';
  let activeSlot = 0;
  let showInstructions = false;

  $: usedColors = currentGuess.filter((c): c is Color => c !== null);
  $: isGuessComplete = currentGuess.every((c) => c !== null);
  $: winMessage = getWinMessage(guesses.length);

  function getWinMessage(attempts: number): string {
    if (attempts === 1) return 'Wizard!';
    if (attempts === 2) return 'Brilliant!';
    if (attempts === 3) return 'Impressive!';
    if (attempts === 4) return 'Great!';
    if (attempts === 5) return 'Nice!';
    if (attempts === 6) return 'Good!';
    return 'Phew!';
  }

  onMount(() => {
    initGame();
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  function initGame() {
    target = shuffleTarget();
    currentGuess = [null, null, null, null];
    guesses = [];
    status = 'playing';
    activeSlot = 0;
  }

  function handleSlotSelect(event: CustomEvent<number>) {
    activeSlot = event.detail;
  }

  function handleColorPick(event: CustomEvent<Color>) {
    const color = event.detail;
    currentGuess[activeSlot] = color;
    currentGuess = [...currentGuess];
    
    const nextEmpty = currentGuess.findIndex((c, i) => c === null && i > activeSlot);
    if (nextEmpty !== -1) {
      activeSlot = nextEmpty;
    } else {
      const firstEmpty = currentGuess.findIndex((c) => c === null);
      if (firstEmpty !== -1) {
        activeSlot = firstEmpty;
      }
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (showInstructions) return;

    if (status !== 'playing') {
      if (e.key === 'Enter') initGame();
      return;
    }

    const keyColorMap: Record<string, Color> = {
      '1': 'blue',
      '2': 'green',
      '3': 'orange',
      '4': 'yellow',
    };

    const color = keyColorMap[e.key.toLowerCase()];
    if (color && !usedColors.includes(color)) {
      currentGuess[activeSlot] = color;
      currentGuess = [...currentGuess];
      
      const nextEmpty = currentGuess.findIndex((c, i) => c === null && i > activeSlot);
      if (nextEmpty !== -1) {
        activeSlot = nextEmpty;
      } else {
        const firstEmpty = currentGuess.findIndex((c) => c === null);
        if (firstEmpty !== -1) {
          activeSlot = firstEmpty;
        }
      }
    }

    if (e.key === 'Backspace') {
      if (currentGuess[activeSlot] !== null) {
        currentGuess[activeSlot] = null;
        currentGuess = [...currentGuess];
      } else {
        for (let i = activeSlot - 1; i >= 0; i--) {
          if (currentGuess[i] !== null) {
            currentGuess[i] = null;
            currentGuess = [...currentGuess];
            activeSlot = i;
            break;
          }
        }
      }
    }

    if (e.key === 'ArrowLeft') activeSlot = Math.max(0, activeSlot - 1);
    if (e.key === 'ArrowRight') activeSlot = Math.min(3, activeSlot + 1);
    if (e.key === 'Enter' && isGuessComplete) submitGuess();
  }

  function submitGuess() {
    if (!isGuessComplete || status !== 'playing') return;

    const guess = currentGuess as Color[];
    const matches = computeMatches(guess, target);
    
    guesses = [...guesses, { guess, matches }];
    
    if (matches === 4) {
      status = 'won';
    } else if (guesses.length >= MAX_ATTEMPTS) {
      status = 'lost';
    } else {
      currentGuess = [null, null, null, null];
      activeSlot = 0;
    }
  }

  function clearGuess() {
    currentGuess = [null, null, null, null];
    activeSlot = 0;
  }
</script>

<Modal bind:open={showInstructions} on:close={() => showInstructions = false}>
  <Instructions />
</Modal>

<div class="game">
  <header>
    <h1>Huedle</h1>
    <button class="help-btn" on:click={() => showInstructions = true} aria-label="How to play">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.5 9.5a2.5 2.5 0 1 1 3 2.4c-.6.2-1 .8-1 1.4V15"/>
        <circle cx="12" cy="18" r="0.5" fill="currentColor"/>
      </svg>
    </button>
  </header>

  {#if status === 'won'}
    <div class="result won">
      <div class="result-badge">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      </div>
      <h2>{winMessage}</h2>
      <p class="stat">{guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}</p>
      <div class="solution">
        {#each target as color}
          <div class="solution-square" style="background: {COLOR_HEX[color]}"></div>
        {/each}
      </div>
      <button class="result-btn won" on:click={initGame}>Play Again</button>
    </div>
  {/if}

  {#if status === 'lost'}
    <div class="result lost">
      <h2>So close!</h2>
      <p class="label">The answer was</p>
      <div class="solution">
        {#each target as color}
          <div class="solution-square" style="background: {COLOR_HEX[color]}"></div>
        {/each}
      </div>
      <button class="result-btn lost" on:click={initGame}>Try Again</button>
    </div>
  {/if}

  <History 
    {guesses} 
    maxAttempts={MAX_ATTEMPTS} 
    {currentGuess}
    {activeSlot}
    isPlaying={status === 'playing'}
    on:select={handleSlotSelect}
  />

  {#if status === 'playing'}
    <div class="input-area">
      <Palette
        {usedColors}
        disabled={status !== 'playing'}
        on:pick={handleColorPick}
      />

      <div class="actions">
        <button class="clear-btn" on:click={clearGuess} disabled={usedColors.length === 0}>
          Clear
        </button>
        <button
          class="submit-btn"
          on:click={submitGuess}
          disabled={!isGuessComplete}
        >
          Submit
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .game {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px 20px 32px;
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding: 8px 0;
  }

  h1 {
    font-size: 32px;
    font-weight: 800;
    color: #f9fafb;
    margin: 0;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .help-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .help-btn:hover {
    background: #1f2937;
    color: #f9fafb;
  }

  .result {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 24px;
    border-radius: 24px;
    margin-bottom: 16px;
  }

  .result.won {
    background: linear-gradient(180deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.04) 100%);
  }

  .result.lost {
    background: linear-gradient(180deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.04) 100%);
  }

  .result-badge {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 20px;
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
  }

  .result h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .won h2 { color: #22c55e; }
  .lost h2 { color: #f9fafb; }

  .result .stat {
    color: #22c55e;
    margin: 6px 0 0;
    font-size: 16px;
    font-weight: 600;
  }

  .result .label {
    color: #6b7280;
    margin: 8px 0 0;
    font-size: 14px;
  }

  .solution {
    display: flex;
    gap: 10px;
    margin: 24px 0;
  }

  .solution-square {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.15);
  }

  .result-btn {
    padding: 14px 32px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    margin-top: 8px;
  }

  .result-btn.won {
    background: #22c55e;
    color: white;
  }

  .result-btn.won:hover {
    background: #16a34a;
  }

  .result-btn.lost {
    background: #3b82f6;
    color: white;
  }

  .result-btn.lost:hover {
    background: #2563eb;
  }

  .input-area {
    margin-top: auto;
    padding-top: 20px;
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 20px;
  }

  .clear-btn {
    background: none;
    border: none;
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 10px 16px;
    border-radius: 8px;
    transition: all 0.15s ease;
  }

  .clear-btn:hover:not(:disabled) {
    color: #f9fafb;
    background: rgba(255, 255, 255, 0.05);
  }

  .clear-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .submit-btn {
    background: #3b82f6;
    border: none;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.15s ease;
  }

  .submit-btn:hover:not(:disabled) {
    background: #2563eb;
  }

  .submit-btn:disabled {
    background: #374151;
    color: #6b7280;
    cursor: not-allowed;
  }

  @media (max-width: 380px) {
    .game {
      padding: 16px 12px 24px;
    }

    h1 {
      font-size: 26px;
    }

    .solution-square {
      width: 40px;
      height: 40px;
    }
  }

  @media (max-height: 700px) {
    .game {
      padding: 12px 16px 20px;
    }

    header {
      margin-bottom: 16px;
    }

    h1 {
      font-size: 24px;
    }
  }
</style>
