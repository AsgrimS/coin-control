<script lang="ts">
	import { commands } from "$lib/bindings"

	let name = $state("")
	let greetMsg = $state("")

	async function greet(event: Event) {
		event.preventDefault()
		// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
		greetMsg = await commands.greet(name)
	}
</script>

<main>
	<h1>Welcome to Tauri + Svelte</h1>

	<p>Click on the Tauri, Vite, and SvelteKit logos to learn more.</p>

	<form onsubmit={greet}>
		<input id="greet-input" placeholder="Enter a name..." bind:value={name} />
		<button class="variant-filled btn" type="submit">Greet</button>
	</form>
	<p>{greetMsg}</p>
</main>
