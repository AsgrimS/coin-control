<script lang="ts">
	import type { BudgetDto } from "$lib/dtos/budget"

	export let budget: BudgetDto
</script>

<span>{budget.amount} $</span>
