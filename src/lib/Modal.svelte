<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let open = false;

  const dispatch = createEventDispatcher<{ close: void }>();

  function handleClose() {
    dispatch('close');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div 
    class="backdrop" 
    on:click={handleBackdropClick} 
    role="presentation"
    transition:fade={{ duration: 150 }}
  >
    <div 
      class="modal" 
      role="dialog" 
      aria-modal="true"
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      <button class="close-btn" on:click={handleClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <slot />
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
  }

  .modal {
    background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
    border-radius: 24px;
    padding: 32px;
    max-width: 420px;
    width: 100%;
    position: relative;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 
      0 0 0 1px rgba(255, 255, 255, 0.05),
      0 20px 50px rgba(0, 0, 0, 0.5);
  }

  .close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 10px;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f9fafb;
  }
</style>
