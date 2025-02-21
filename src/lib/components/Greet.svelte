<script lang="ts">
  import { commands } from "$lib/bindings"

  let name = $state("")
  let greetMsg = $state("")

  async function greetHandler(event: Event) {
    event.preventDefault()
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    greetMsg = await commands.greet(name)
  }
</script>

<div class="card flex flex-col gap-4 p-4">
  <label class="label">
    <span>Enter your name</span>
    <input id="gree-input" placeholder="Enter a name..." bind:value={name} class="input" />
  </label>
  <button class="btn preset-filled" onclick={greetHandler}>Greet</button>
  <p class="card-footer">{greetMsg}</p>
</div>
