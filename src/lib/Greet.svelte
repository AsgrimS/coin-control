<script lang="ts">
  import { invoke } from "@tauri-apps/api/core"

  let name = $state("")
  let greetMsg = $state("")

  async function greet(event: Event) {
    event.preventDefault()
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsg = await invoke("greet", { name })
  }
</script>

<div class="card flex flex-col gap-4 p-4">
  <label class="label">
    <span>Enter your name</span>
    <input id="gree-input" placeholder="Enter a name..." bind:value={name} class="input" />
  </label>
  <button class="variant-filled btn" onclick={greet}>Greet</button>
  <p class="card-footer">{greetMsg}</p>
</div>
