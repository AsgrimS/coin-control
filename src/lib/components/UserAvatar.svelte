<script lang="ts">
	import { Avatar, getDrawerStore, type DrawerSettings } from "@skeletonlabs/skeleton"
	import type { User } from "lucia"

	export let user: User

	const getInitials = (username: string) => {
		const names = username.split(" ")
		const initials = names.map((name) => name[0]).join("")
		return initials
	}

	const drawerStore = getDrawerStore()
	const drawerSettings: DrawerSettings = {
		id: "userMenu",
		position: "right",
		width: "w-64"
	}
</script>

<button class="rounded-full bg-black" on:click={() => drawerStore.open(drawerSettings)}>
	<Avatar
		border="border-2 border-surface-300-600-token hover:!border-primary-500"
		cursor="cursor-pointer"
		width="w-10"
		initials={getInitials(user.username)}
	/>
</button>
