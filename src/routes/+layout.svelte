<script lang="ts">
	import "../app.postcss"
	import { Drawer, getDrawerStore, initializeStores } from "@skeletonlabs/skeleton"
	import { onMount } from "svelte"
	import type { PageData } from "./$types"
	import UserDrawer from "$lib/components/UserDrawer.svelte"
	import AddTransactionDrawer from "$lib/components/AddTransactionDrawer.svelte"

	export let data: PageData
	let { user } = data
	$: user = data.user

	initializeStores()
	const drawerStore = getDrawerStore()

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

<Drawer>
	{#if $drawerStore.id === "userMenu" && user}
		<UserDrawer {user} />
	{:else if $drawerStore.id === "addTransaction"}
		<AddTransactionDrawer />
	{/if}
</Drawer>

<!-- <AppBar padding="px-4"> -->
<!-- 	<svelte:fragment slot="lead"> -->
<!-- 		<a class="py-4" href="/"> -->
<!-- 			<strong class="text-xl uppercase">Coin Control</strong> -->
<!-- 		</a> -->
<!-- 	</svelte:fragment> -->
<!-- 	<svelte:fragment slot="trail"> -->
<!-- 		{#if user !== null} -->
<!-- 			<UserAvatar {user} /> -->
<!-- 		{:else} -->
<!-- 			<div class="variant-filled btn-group"> -->
<!-- 				<a href="/signup">Sign Up</a> -->
<!-- 				<a href="/login"> Login </a> -->
<!-- 			</div> -->
<!-- 		{/if} -->
<!-- 	</svelte:fragment> -->
<!-- </AppBar> -->
<!-- Adjust for the height of the AppBar -->
<div class="h-full p-4">
	<slot />
</div>
