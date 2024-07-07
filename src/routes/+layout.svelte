<script lang="ts">
	import "../app.postcss"
	import { AppBar, Avatar } from "@skeletonlabs/skeleton"

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom"
	import { storePopup } from "@skeletonlabs/skeleton"
	import type { PageData } from "./$types"
	import { onMount } from "svelte"
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow })

	export let data: PageData
	let { user } = data
	$: user = data.user

	const getInitials = (username: string) => {
		const names = username.split(" ")
		const initials = names.map((name) => name[0]).join("")
		return initials
	}

	const detectSWUpdate = async () => {
		const registration = await navigator.serviceWorker.ready

		registration.addEventListener("updatefound", () => {
			const newSW = registration.installing
			newSW?.addEventListener("statechange", () => {
				if (newSW.state === "installed") {
					if (navigator.serviceWorker.controller) {
						if (confirm("New content is available! Reaload to update?")) {
							newSW.postMessage({ type: "SKIP_WAITING" })
							window.location.reload()
						}
					}
				}
			})
		})
	}

	onMount(() => {
		detectSWUpdate()
	})
</script>

<AppBar padding="px-4">
	<svelte:fragment slot="lead">
		<a class="py-4" href="/">
			<strong class="text-xl uppercase">Coin Control</strong>
		</a>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		{#if user !== null}
			<a href="/logout" data-sveltekit-preload-data="off" data-sveltekit-reload> Logout </a>
			<Avatar width="w-8" initials={getInitials(user.username)} />
		{:else}
			<div class="variant-filled btn-group">
				<a href="/signup">Sign Up</a>
				<a href="/login"> Login </a>
			</div>
		{/if}
	</svelte:fragment>
</AppBar>
<!-- Adjust for the height of the AppBar -->
<div class="h-[calc(100%_-_64px)] p-8">
	<slot />
</div>
