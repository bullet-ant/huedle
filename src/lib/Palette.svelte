<script lang="ts">
  import type { Color } from '../utils/logic';
  import { COLORS, COLOR_HEX } from '../utils/logic';

  export let usedColors: Color[] = [];
  export let disabled: boolean = false;

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher<{ pick: Color }>();

  function handleClick(color: Color) {
    if (!disabled && !usedColors.includes(color)) {
      dispatch('pick', color);
    }
  }

  function getKeyLabel(color: Color): string {
    const keyMap: Record<Color, string> = {
      blue: '1',
      green: '2',
      orange: '3',
      yellow: '4',
    };
    return keyMap[color];
  }
</script>

<div class="palette">
  {#each COLORS as color}
    <button
      class="color-btn"
      class:used={usedColors.includes(color)}
      style="--color: {COLOR_HEX[color]}"
      on:click={() => handleClick(color)}
      disabled={disabled || usedColors.includes(color)}
      aria-label={color}
    >
      <span class="key">{getKeyLabel(color)}</span>
    </button>
  {/each}
</div>

<style>
  .palette {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .color-btn {
    width: 52px;
    height: 52px;
    border: none;
    border-radius: 14px;
    background: var(--color);
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .color-btn:hover:not(:disabled) {
    transform: scale(1.08);
  }

  .color-btn:disabled {
    cursor: not-allowed;
  }

  .color-btn.used {
    opacity: 0.2;
    transform: scale(0.9);
  }

  .key {
    font-size: 18px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .color-btn.used .key {
    opacity: 0;
  }

  @media (max-width: 380px) {
    .palette {
      gap: 10px;
    }

    .color-btn {
      width: 46px;
      height: 46px;
      border-radius: 12px;
    }

    .key {
      font-size: 16px;
    }
  }
</style>
