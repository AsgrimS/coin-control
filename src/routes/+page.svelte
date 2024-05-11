<script lang="ts">
	import CreateBudgetButton from "$lib/components/CreateBudgetButton.svelte"
	import type { PageData } from "./$types"

	export let data: PageData
	let { budgets } = data
	$: budgets = data.budgets
</script>

<div class="container mx-auto flex h-full items-center justify-center">
	{#if budgets.length === 0}
		<div class="flex flex-col items-center gap-1 text-center">
			<p class="text-xl">No budgets to display. <br /> Click below to create a new one.</p>
			<CreateBudgetButton />
		</div>
	{:else}
		<p>Budget</p>
	{/if}
</div>
