<script lang="ts">
	import { getDrawerStore, type DrawerSettings } from "@skeletonlabs/skeleton"
	import DotsVerticalIcon from "~icons/tabler/dots-vertical"

	const drawerStore = getDrawerStore()
	const drawerSettings: DrawerSettings = {
		id: "userMenu",
		position: "right",
		width: "w-64"
	}
</script>

<button class="btn-icon btn-icon-lg" on:click={() => drawerStore.open(drawerSettings)}>
	<DotsVerticalIcon />
</button>
