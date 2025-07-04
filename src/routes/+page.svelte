<script lang="ts">
  import { commands } from "$lib/bindings"

  async function greetHandler(event: Event) {
    event.preventDefault()
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    await commands.greet("foo")
  }
</script>

<!-- Content -->
<div class="flex h-full items-center justify-center">
  <!-- <Coins size={128} class="text-surface-900" /> -->
  <button type="button" class="btn preset-filled-tertiary-500" onclick={greetHandler}>Click</button>
</div>
