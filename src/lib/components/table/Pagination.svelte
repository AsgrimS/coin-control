<script lang="ts">
	import type { DataHandler } from "@vincjo/datatables"
	import CaretRightIcon from "~icons/tabler/caret-right"
	import CaretLeftIcon from "~icons/tabler/caret-left"

	export let handler: DataHandler
	const pageNumber = handler.getPageNumber()
	const pageCount = handler.getPageCount()
	const pages = handler.getPages({ ellipsis: true })
</script>

<!-- Desktop buttons -->
<section class="variant-ghost-surface btn-group hidden lg:flex [&>*+*]:border-surface-500">
	<button
		type="button"
		class="hover:variant-soft-primary"
		class:disabled={$pageNumber === 1}
		on:click={() => handler.setPage("previous")}
	>
		<CaretLeftIcon />
	</button>
	{#each $pages as page}
		<button
			type="button"
			class="hover:variant-soft-primary"
			class:active={$pageNumber === page}
			class:ellipse={page === null}
			on:click={() => handler.setPage(page)}
		>
			{page ?? "..."}
		</button>
	{/each}
	<button
		type="button"
		class="hover:variant-soft-primary"
		class:disabled={$pageNumber === $pageCount}
		on:click={() => handler.setPage("next")}
	>
		<CaretRightIcon />
	</button>
</section>

<!-- Mobile buttons -->
<section class="lg:hidden">
	<button
		type="button"
		class="variant-ghost-surface btn btn-icon mr-2 hover:variant-soft-primary"
		class:disabled={$pageNumber === 1}
		on:click={() => handler.setPage("previous")}
	>
		<CaretLeftIcon />
	</button>
	<button
		type="button"
		class="variant-ghost-surface btn-icon hover:variant-soft-primary"
		class:disabled={$pageNumber === $pageCount}
		on:click={() => handler.setPage("next")}
	>
		<CaretRightIcon />
	</button>
</section>
