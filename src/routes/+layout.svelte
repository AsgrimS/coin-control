<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar, Avatar } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	export let data: PageData;
	const { user } = data;

	const getInitials = (username: string) => {
		const names = username.split(' ');
		const initials = names.map((name) => name[0]).join('');
		return initials;
	};
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<a href="/">
					<strong class="text-xl uppercase">Coin Control</strong>
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if user !== null}
					<a href="/logout"> Logout </a>
					<Avatar width="w-8" initials={getInitials(user.username)} />
				{:else}
					<a href="/signup"> Sign Up </a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
