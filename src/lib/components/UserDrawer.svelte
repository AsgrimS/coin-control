<script lang="ts">
	import type { User } from "lucia"

	export let user: User
</script>

<section class="flex h-full flex-col p-4">
	<h4 class="h4 !border-double">Hello {user.username}</h4>
	<hr />
	<a
		class="variant-filled btn mt-auto"
		href="/logout"
		data-sveltekit-preload-data="off"
		data-sveltekit-reload
	>
		Logout
	</a>
</section>
