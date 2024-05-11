<script lang="ts">
	import type { PageData } from "./$types"

	export let data: PageData
	let { budgets } = data
	$: budgets = data.budgets
</script>

<div class="container mx-auto flex h-full items-center justify-center">
	{#if budgets.length === 0}
		<p>No budgets to display</p>
	{:else}
		<p>Budget</p>
	{/if}
</div>
