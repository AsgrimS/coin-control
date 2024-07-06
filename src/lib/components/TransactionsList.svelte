<script lang="ts">
	import type { TransactionDto } from "$lib/dtos/transaction"

	export let transactions: TransactionDto[]

	const dateFormatter = new Intl.DateTimeFormat("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric"
	})
</script>

<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Amount</th>
				<th>Date</th>
			</tr>
		</thead>
		<tbody>
			{#each transactions as transaction}
				<tr>
					<td>$ {transaction.amount}</td>
					<td>{dateFormatter.format(new Date(transaction.createdAt + " GMT"))}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
