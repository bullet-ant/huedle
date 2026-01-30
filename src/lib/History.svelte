<script lang="ts">
  import type { Color, GuessResult } from '../utils/logic';
  import { COLOR_HEX, COLOR_TO_NUM } from '../utils/logic';
  import { createEventDispatcher } from 'svelte';

  export let guesses: GuessResult[] = [];
  export let maxAttempts: number = 7;
  export let currentGuess: (Color | null)[] = [null, null, null, null];
  export let activeSlot: number = 0;
  export let isPlaying: boolean = true;

  const dispatch = createEventDispatcher<{ select: number }>();

  function handleSlotClick(slotIndex: number) {
    if (isPlaying) {
      dispatch('select', slotIndex);
    }
  }
</script>

<div class="history">
  {#each Array(maxAttempts) as _, i}
    {@const result = guesses[i]}
    {@const isCurrent = i === guesses.length && isPlaying}
    <div class="row" class:filled={result} class:current={isCurrent} class:miss={result && result.matches === 0}>
      <span class="num">{i + 1}</span>
      <div class="colors">
        {#if result}
          {#each result.guess as color}
            <div class="square" style="background: {COLOR_HEX[color]}">
              <span class="slot-num">{COLOR_TO_NUM[color]}</span>
            </div>
          {/each}
        {:else if isCurrent}
          {#each currentGuess as color, j}
            <button
              class="square input"
              class:active={activeSlot === j}
              class:filled={color !== null}
              style={color ? `background: ${COLOR_HEX[color]}` : ''}
              on:click={() => handleSlotClick(j)}
            >
              {#if color}
                <span class="slot-num">{COLOR_TO_NUM[color]}</span>
              {/if}
            </button>
          {/each}
        {:else}
          {#each Array(4) as _}
            <div class="square empty"></div>
          {/each}
        {/if}
      </div>
      <div class="dots">
        {#each Array(4) as _, j}
          {#if result}
            {#if j < result.matches}
              <div class="dot on"></div>
            {:else}
              <span class="dot-x">✕</span>
            {/if}
          {:else}
            <div class="dot"></div>
          {/if}
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .history {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: #0f1219;
    border-radius: 20px;
    padding: 16px;
    overflow-y: auto;
    min-height: 0;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: #161b26;
    border-radius: 14px;
    transition: all 0.2s ease;
    opacity: 0.35;
  }

  .row.filled {
    opacity: 1;
    background: #1a2030;
  }

  .row.current {
    opacity: 1;
    background: #1e2a3d;
  }

  .row.miss {
    background: #1f1a1a;
  }

  .dot-x {
    font-size: 14px;
    font-weight: 700;
    color: #ef4444;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
  }

  .num {
    width: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
    text-align: center;
  }

  .row.filled .num,
  .row.current .num {
    color: #6b7280;
  }

  .colors {
    display: flex;
    gap: 8px;
    flex: 1;
  }

  .square {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    transition: all 0.15s ease;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .square.empty {
    background: #252d3d;
  }

  .slot-num {
    font-size: 14px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .square.input {
    background: #252d3d;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .square.input:hover {
    background: #2d3748;
  }

  .square.input.active {
    box-shadow: 0 0 0 2px #f59e0b;
  }

  .square.input.filled {
    cursor: pointer;
  }

  .dots {
    display: flex;
    gap: 6px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #252d3d;
    transition: all 0.2s ease;
  }

  .dot.on {
    background: #fff;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }

  @media (max-height: 700px) {
    .history {
      gap: 4px;
      padding: 12px;
    }

    .row {
      padding: 8px 10px;
    }

    .square {
      width: 32px;
      height: 32px;
    }
  }

  @media (max-width: 380px) {
    .history {
      padding: 12px;
    }

    .row {
      gap: 8px;
      padding: 8px 10px;
    }

    .num {
      width: 16px;
      font-size: 12px;
    }

    .colors {
      gap: 6px;
    }

    .square {
      width: 30px;
      height: 30px;
      border-radius: 8px;
    }

    .dots {
      gap: 4px;
    }

    .dot {
      width: 10px;
      height: 10px;
    }
  }
</style>
