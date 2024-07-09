<script lang="ts">
	import type { BudgetDto } from "$lib/dtos/budget"

	export let budget: BudgetDto
	export let spent: number

	$: leftover = budget.amount - spent
</script>

<div class="card variant-soft-surface flex flex-grow flex-col p-2">
	<div class="flex flex-col gap-1">
		<div class="flex flex-col">
			<span class="font-bold">Limit:</span>
			<span>$ {budget.amount}</span>
		</div>

		<div class="flex flex-col">
			<span class="font-bold">Spent:</span>
			<span>$ {spent}</span>
		</div>

		<div class="flex flex-col">
			<span class="font-bold">Left:</span>
			<span>$ {leftover}</span>
		</div>

		<div class="flex flex-col">
			<span class="font-bold">Resets:</span>
			<span>{budget.resetFrequency}</span>
		</div>
	</div>
</div>
