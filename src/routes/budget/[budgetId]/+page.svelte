<script lang="ts">
	import type { PageData } from "./$types"

	export let data: PageData
	$: budget = data.budget
</script>

{budget.amount} $
