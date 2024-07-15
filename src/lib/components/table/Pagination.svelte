<script lang="ts">
	import type { DataHandler } from "@vincjo/datatables"
	import CaretRightIcon from "~icons/tabler/caret-right"
	import CaretLeftIcon from "~icons/tabler/caret-left"

	export let handler: DataHandler
	const pageNumber = handler.getPageNumber()
	const pageCount = handler.getPageCount()

	pageCount.subscribe((value) => {
		if ($pageNumber > value) handler.setPage(value)
	})
</script>

<section>
	<button
		type="button"
		class="variant-ghost-surface btn btn-icon mr-2"
		disabled={$pageNumber === 1}
		on:click={() => handler.setPage("previous")}
	>
		<CaretLeftIcon />
	</button>
	<button
		type="button"
		class="variant-ghost-surface btn-icon"
		disabled={$pageNumber === $pageCount}
		on:click={() => handler.setPage("next")}
	>
		<CaretRightIcon />
	</button>
</section>
