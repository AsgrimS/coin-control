<script lang="ts">
	import "../app.postcss"
	import {
		Drawer,
		getDrawerStore,
		initializeStores,
		Modal,
		type ModalComponent
	} from "@skeletonlabs/skeleton"
	import { onMount } from "svelte"
	import type { PageData } from "./$types"
	import UserDrawer from "$lib/components/UserDrawer.svelte"
	import AddTransactionDrawer from "$lib/components/AddTransactionDrawer.svelte"
	import TransactionDetailsModal from "$lib/components/TransactionDetailsModal.svelte"

	export let data: PageData
	let { user } = data
	$: user = data.user

	initializeStores()
	const drawerStore = getDrawerStore()

	const modalRegistry: Record<string, ModalComponent> = {
		transactionDetails: { ref: TransactionDetailsModal }
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

<Drawer>
	{#if $drawerStore.id === "userMenu" && user}
		<UserDrawer {user} />
	{:else if $drawerStore.id === "addTransaction"}
		<AddTransactionDrawer />
	{/if}
</Drawer>

<Modal components={modalRegistry} />

<div class="h-full p-4">
	<slot />
</div>
