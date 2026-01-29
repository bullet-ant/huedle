<script lang="ts">
  import Game from './lib/Game.svelte';
</script>

<main>
  <Game />
</main>

<style>
  main {
    min-height: 100vh;
    background: 
      radial-gradient(ellipse at top, #1a1f2e 0%, transparent 50%),
      #0a0e17;
  }
</style>
