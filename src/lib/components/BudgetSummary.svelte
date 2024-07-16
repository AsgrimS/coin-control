<script lang="ts">
	import { getDateFormatter } from "$lib/common"
	import type { BudgetDto } from "$lib/dtos/budget"

	export let budget: BudgetDto
	export let spent: number

	const dateFormatter = getDateFormatter("short")

	$: leftover = budget.amount - spent
</script>

<div class="card variant-soft-surface flex flex-grow flex-col p-2">
	<div class="flex flex-col gap-1">
		<div class="flex flex-col">
			<span class="font-bold">Limit:</span>
			<span>$ {budget.amount.toFixed(2)}</span>
		</div>

		<div class="flex flex-col">
			<span class="font-bold">Spent:</span>
			<span>$ {spent.toFixed(2)}</span>
		</div>

		<div class="flex flex-col">
			<span class="font-bold">Left:</span>
			<span>$ {leftover.toFixed(2)}</span>
		</div>

		<div class="flex flex-col">
			<span class="font-bold">Resets:</span>
			<span>{dateFormatter.format(budget.nextReset)}</span>
		</div>
	</div>
</div>
