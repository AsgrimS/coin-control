<script lang="ts">
	import type { TransactionDto } from "$lib/dtos/transaction"
	import { DataHandler } from "@vincjo/datatables"
	import ThSort from "$lib/components/table/ThSort.svelte"
	import RowCount from "$lib/components/table/RowCount.svelte"
	import Pagination from "$lib/components/table/Pagination.svelte"
	import TrashIcon from "~icons/tabler/trash"
	import { superForm, type SuperValidated } from "sveltekit-superforms"
	import LoadingSpinner from "./LoadingSpinner.svelte"
	import SquarePlusIcon from "~icons/tabler/square-plus"
	import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton"

	export let transactions: TransactionDto[]
	export let deleteFormActionName: string
	export let deleteTransactionForm: SuperValidated<{ transactionId: string }>
	export let onAddTransaction: () => void

	let transactionIdBeingProcessed: string

	const modalStore = getModalStore()
	const getConfirmation = async () =>
		new Promise<boolean>((resolve) => {
			const modal: ModalSettings = {
				type: "confirm",
				title: "Please Confirm",
				body: "Are you sure you want to delete the transaction?",
				buttonTextConfirm: "Delete",
				modalClasses: "[&>footer>button:nth-child(2)]:!variant-filled-error",
				response: (r: boolean) => resolve(r)
			}
			modalStore.trigger(modal)
		}).then((confirmation) => confirmation)

	const { enhance, delayed } = superForm(deleteTransactionForm, {
		async onSubmit({ formData, cancel }) {
			transactionIdBeingProcessed = String(formData.get("transactionId"))
			const confirmation = await getConfirmation()
			if (!confirmation) cancel()
		}
	})

	const dateFormatter = new Intl.DateTimeFormat("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric"
	})

	const handler = new DataHandler(transactions, { rowsPerPage: 10 })
	const rows = handler.getRows()

	$: handler.setRows(transactions)
</script>

<article class="table-container">
	<table class="table table-compact overflow-visible">
		<thead class="sticky top-0">
			<tr class="[&>th]:!p-2">
				<ThSort {handler} orderBy="amount">Amount</ThSort>
				<ThSort {handler} orderBy="createdAt">Date</ThSort>
				<th class="text-center">
					<button class="variant-filled btn-icon" on:click={onAddTransaction}>
						<SquarePlusIcon />
					</button>
				</th>
			</tr>
		</thead>
		<tbody>
			{#if $rows.length === 0}
				<tr>
					<td colspan="2" class="text-center">Submit new transaction to see it here</td>
				</tr>
			{:else}
				{#each $rows as row}
					<tr>
						<td>$ {row.amount}</td>
						<td>{dateFormatter.format(new Date(row.createdAt + " GMT"))}</td>
						<td class="text-center">
							<form method="post" action={`?/${deleteFormActionName}`} use:enhance>
								<input type="hidden" name="transactionId" value={row.id} />
								<button class="btn-icon w-auto" disabled={$delayed}>
									{#if $delayed && transactionIdBeingProcessed === row.id}
										<LoadingSpinner width="w-5" />
									{:else}
										<TrashIcon class="text-error-500" />
									{/if}
								</button>
							</form>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</article>

<footer class="mt-auto flex min-h-12 justify-between">
	<RowCount {handler} />
	<div class:hidden={transactions.length <= 10}>
		<Pagination {handler} />
	</div>
</footer>
