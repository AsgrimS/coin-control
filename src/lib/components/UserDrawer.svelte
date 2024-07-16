<script lang="ts">
	import { getDrawerStore } from "@skeletonlabs/skeleton"
	import XIcon from "~icons/tabler/x"
	import type { User } from "lucia"

	export let user: User

	const drawerStore = getDrawerStore()
</script>

<section class="flex h-full flex-col p-4">
	<div class="flex items-center justify-between">
		<h4 class="h4">Hello {user.username}</h4>
		<button class="btn-icon btn-icon-sm" on:click={() => drawerStore.close()}><XIcon /></button>
	</div>
	<hr class="mb-4 mt-1" />
	<div class="flex flex-col gap-4">
		<button disabled class="variant-filled btn">Edit Budget</button>
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
