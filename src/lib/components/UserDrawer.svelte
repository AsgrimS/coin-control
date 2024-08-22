<script lang="ts">
	import { getDrawerStore } from "@skeletonlabs/skeleton"
	import XIcon from "~icons/tabler/x"
	import type { User } from "lucia"
	import { navigating } from "$app/stores"

	export let user: User
	export let budgetId: string | null

	const drawerStore = getDrawerStore()

	navigating.subscribe((navigation) => {
		if (navigation) drawerStore.close()
	})
</script>

<section class="flex h-full flex-col p-4">
	<div class="flex items-center justify-between">
		<h4 class="h4">Hello {user.username}</h4>
		<button class="btn-icon btn-icon-sm" on:click={() => drawerStore.close()}><XIcon /></button>
	</div>
	<hr class="mb-4 mt-1" />
	<div class="flex flex-col gap-4">
		{#if budgetId}
			<a class="variant-filled btn" href={`/budget/edit/${budgetId}`}>Edit Budget</a>
		{:else}
			<button disabled class="variant-filled btn">Edit Budget</button>
		{/if}
		<button disabled class="variant-filled btn">Create New Budget</button>
	</div>
	<hr class="my-2 mt-auto" />
	<a
		class="variant-filled-secondary btn"
		href="/logout"
		data-sveltekit-preload-data="off"
		data-sveltekit-reload
	>
		Logout
	</a>
</section>
