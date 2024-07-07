<script lang="ts">
	import type { TransactionDto } from "$lib/dtos/transaction"
	import { DataHandler } from "@vincjo/datatables"
	import ThSort from "$lib/components/table/ThSort.svelte"
	import RowCount from "$lib/components/table/RowCount.svelte"
	import Pagination from "$lib/components/table/Pagination.svelte"

	export let transactions: TransactionDto[]

	const dateFormatter = new Intl.DateTimeFormat("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric"
	})

	const handler = new DataHandler(transactions, { rowsPerPage: 15 })
	const rows = handler.getRows()
</script>

<article class="table-container">
	<table class="table table-compact overflow-visible">
		<thead class="sticky top-0">
			<tr>
				<ThSort {handler} orderBy="amount">Amount</ThSort>
				<ThSort {handler} orderBy="createdAt">Date</ThSort>
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					<td>{row.amount}</td>
					<td>{dateFormatter.format(new Date(row.createdAt + " GMT"))}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</article>

<footer class="flex justify-between">
	<RowCount {handler} />
	<Pagination {handler} />
</footer>
