<script lang="ts">
  import type { Color } from '../utils/logic';
  import { COLOR_HEX, COLOR_TO_NUM } from '../utils/logic';

  const secret: Color[] = ['green', 'orange', 'blue', 'yellow'];

  const examples: { guess: Color[]; matches: number; note: string }[] = [
    {
      guess: ['blue', 'green', 'orange', 'yellow'],
      matches: 1,
      note: 'yellow correct',
    },
    {
      guess: ['green', 'orange', 'yellow', 'blue'],
      matches: 2,
      note: 'green, orange correct',
    },
    {
      guess: ['green', 'orange', 'blue', 'yellow'],
      matches: 4,
      note: 'solved',
    },
  ];
</script>

<div class="instructions">
  <h2>How to Play</h2>
  
  <p class="goal">Find the hidden 4-color sequence</p>

  <div class="demo">
    <div class="answer-row">
      <div class="answer-label">Answer</div>
      <div class="colors">
        {#each secret as color}
          <div class="square" style="background-color: {COLOR_HEX[color]}">
            <span class="slot-num">{COLOR_TO_NUM[color]}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="guesses-section">
      {#each examples as example, i}
        <div class="row" class:solved={example.matches === 4}>
          <div class="colors">
            {#each example.guess as color}
              <div class="square" style="background-color: {COLOR_HEX[color]}">
                <span class="slot-num">{COLOR_TO_NUM[color]}</span>
              </div>
            {/each}
          </div>
          <div class="feedback">
            <div class="dots">
              {#each Array(4) as _, j}
                {#if j < example.matches}
                  <div class="dot on"></div>
                {:else}
                  <span class="dot-x">✕</span>
                {/if}
              {/each}
            </div>
            <span class="note">{example.note}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <ul class="rules">
    <li>Crack the secret color code</li>
    <li>No repeats - each color once</li>
    <li>● = correct position, ✕ = wrong position</li>
    <li>7 tries. Good luck!</li>
  </ul>

  <div class="keys">
    <kbd>←</kbd><kbd>→</kbd>
    <span class="desc">navigate</span>
    <span class="sep">·</span>
    <kbd>Backspace</kbd>
    <span class="desc">clear</span>
    <span class="sep">·</span>
    <kbd>Enter</kbd>
    <span class="desc">submit</span>
  </div>
</div>

<style>
  .instructions {
    color: #e5e7eb;
  }

  h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    color: #f9fafb;
    text-align: center;
  }

  .goal {
    text-align: center;
    color: #9ca3af;
    margin: 6px 0 24px;
    font-size: 15px;
  }

  .demo {
    background: #111827;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .answer-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 16px;
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05));
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 12px;
    margin-bottom: 16px;
  }

  .answer-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
    color: #22c55e;
  }

  .colors {
    display: flex;
    gap: 8px;
  }

  .square {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slot-num {
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .guesses-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #1f2937;
    border-radius: 10px;
  }

  .row.solved {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05));
    box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0.4);
  }

  .row .square {
    width: 28px;
    height: 28px;
    border-radius: 6px;
  }

  .row .colors {
    gap: 6px;
  }

  .feedback {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .dots {
    display: flex;
    gap: 5px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #374151;
  }

  .dot.on {
    background: #ffffff;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
  }

  .dot-x {
    font-size: 12px;
    font-weight: 700;
    color: #ef4444;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 10px;
  }

  .note {
    font-size: 11px;
    color: #6b7280;
  }

  .row.solved .note {
    color: #22c55e;
    font-weight: 500;
  }

  .rules {
    margin: 0 0 20px;
    padding: 0 0 0 20px;
    font-size: 14px;
    color: #9ca3af;
    line-height: 1.8;
  }

  .rules li {
    margin: 0;
  }

  .sep {
    color: #4b5563;
  }

  .keys {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    padding-top: 16px;
    border-top: 1px solid #374151;
  }

  .keys .desc {
    font-size: 12px;
    color: #6b7280;
    margin-left: 2px;
  }

  kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 6px;
    font-size: 12px;
    font-family: inherit;
    font-weight: 500;
    background: #374151;
    border-radius: 6px;
    color: #e5e7eb;
  }

  @media (max-width: 380px) {
    .demo {
      padding: 14px;
    }

    .square {
      width: 26px;
      height: 26px;
    }

    .row .square {
      width: 24px;
      height: 24px;
    }

    .rules {
      font-size: 13px;
    }
  }
</style>
