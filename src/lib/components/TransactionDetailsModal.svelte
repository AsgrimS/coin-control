<script lang="ts">
	import { getModalStore } from "@skeletonlabs/skeleton"
	import type { TransactionDto } from "$lib/dtos/transaction"
	import { getDateFormatter } from "$lib/common"

	export let parent

	const modalCss = [
		parent.regionBody,
		parent.background,
		parent.height,
		parent.width,
		parent.rounded,
		parent.shadow,
		parent.spacing,
		parent.padding
	].join(" ")

	const modalStore = getModalStore()
	$: transaction = $modalStore[0]?.meta.transaction as TransactionDto | undefined

	const dateFormatter = getDateFormatter("long")
</script>

{#if transaction}
	<div class={modalCss}>
		<div class="flex flex-col justify-center gap-1">
			{#if transaction.title}
				<div class="flex flex-col items-center">
					<span class="font-bold">Title:</span>
					<span>{transaction.title}</span>
				</div>
			{/if}

			<div class="flex flex-col items-center">
				<span class="font-bold">Spent:</span>
				<span>$ {transaction.amount.toFixed(2)}</span>
			</div>

			<div class="flex flex-col items-center">
				<span class="font-bold">Date:</span>
				<span>{dateFormatter.format(transaction.createdAt)}</span>
			</div>
		</div>
	</div>
{/if}
