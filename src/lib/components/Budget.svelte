<script lang="ts">
	import type { BudgetDTO } from "$lib/dtos/budget"

	export let budget: BudgetDTO
</script>

<a class="variant-filled btn" href={`/budget/details/${budget.id}`}>Budget: ${budget.allowance}</a>
