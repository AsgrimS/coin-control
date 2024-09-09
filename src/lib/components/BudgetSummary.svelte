<script lang="ts">
	import { getDateFormatter } from "$lib/common"
	import type { BudgetDTO } from "$lib/dtos/budget"

	export let budget: BudgetDTO
	export let spent: number

	const dateFormatter = getDateFormatter("short")

	$: leftover = budget.allowance - spent
</script>

<div class="card variant-soft-surface flex flex-grow flex-col p-2">
	<div class="flex flex-col gap-1">
		<div class="flex flex-col">
			<span class="font-bold">Limit:</span>
			<span>$ {budget.allowance.toFixed(2)}</span>
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
