<script lang="ts">
  import { commands } from "$lib/bindings"
  import Coins from "lucide-svelte/icons/coins"

  async function greetHandler(event: Event) {
    event.preventDefault()
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    console.log(await commands.greet("foo"))
  }
</script>

<!-- Content -->
<div class="flex h-full items-center justify-center"><Coins size={128} class="text-surface-900" /></div>
<button type="button" class="btn preset-filled-tertiary-500" onclick={greetHandler}>Click</button>
