<script lang="ts">
	import type { BudgetDto } from "$lib/dtos/budget"

	export let budget: BudgetDto
</script>

<a class="variant-filled btn" href={`/budget/${budget.id}`}> Budget: ${budget.amount} </a>
