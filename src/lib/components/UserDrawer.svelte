<script lang="ts">
	import type { User } from "lucia"

	export let user: User
</script>

<section class="flex h-full flex-col p-4">
	<h4 class="h4">Hello {user.username}</h4>
	<hr class="mb-4 mt-1" />
	<div class="flex flex-col gap-4">
		<button class="variant-filled btn">Edit Budget</button>
		<button class="variant-filled btn">Create New Budget</button>
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
