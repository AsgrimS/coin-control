<script lang="ts">
	import type { PageData } from "./$types"
	import SpendingRadial from "$lib/components/SpendingRadial.svelte"
	import { RangeSlider } from "@skeletonlabs/skeleton"

	export let data: PageData
	let expenses = 0
</script>

<section>
	<SpendingRadial spent={expenses} limit={data.budget.amount} />
	<div class="mt-4 w-96">
		<RangeSlider bind:value={expenses} max={data.budget.amount} step={1} name="test" />
	</div>
</section>
