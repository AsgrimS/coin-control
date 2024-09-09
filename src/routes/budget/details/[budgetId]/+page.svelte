<script lang="ts">
	import type { PageData } from "./$types"
	import SpendingRadial from "$lib/components/SpendingRadial.svelte"
	import TransactionsList from "$lib/components/TransactionsList.svelte"
	import UserMenuButton from "$lib/components/UserMenuButton.svelte"
	import BudgetSummary from "$lib/components/BudgetSummary.svelte"
	import { getDrawerStore, type DrawerSettings } from "@skeletonlabs/skeleton"

	export let data: PageData

	const drawerStore = getDrawerStore()
	const drawerSettings: DrawerSettings = {
		id: "addTransaction",
		position: "bottom",
		height: "h-auto",
		meta: {
			createTransactionForm: data.createTransactionForm,
			createTransactionFormActionName: "createTransaction"
		}
	}

	const addTransaction = () => {
		drawerStore.open(drawerSettings)
	}

	$: expenses = data.budget.transactions.reduce((acc, curr) => acc + curr.amount, 0)
</script>

<section class="container mx-auto flex h-full flex-col gap-4">
	<div class="card flex items-center justify-between">
		<h3 class="h3 ml-4">{data.budget.name}</h3>
		<UserMenuButton />
	</div>

	<div class="card flex gap-2 p-2">
		<div class="w-60">
			<SpendingRadial spent={expenses} limit={data.budget.allowance} />
		</div>
		<BudgetSummary budget={data.budget} spent={expenses} />
	</div>

	<TransactionsList
		transactions={data.budget.transactions}
		deleteFormActionName={"deleteTransaction"}
		deleteTransactionForm={data.removeTransactionForm}
		onAddTransaction={addTransaction}
	/>
</section>
