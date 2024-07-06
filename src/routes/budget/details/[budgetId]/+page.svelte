<script lang="ts">
	import type { PageData } from "./$types"
	import SpendingRadial from "$lib/components/SpendingRadial.svelte"
	import { superForm } from "sveltekit-superforms"
	import FormError from "$lib/components/FormError.svelte"
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte"
	import TransactionsList from "$lib/components/TransactionsList.svelte"

	export let data: PageData
	$: expenses = data.transactions.reduce((acc, curr) => acc + curr.amount, 0)

	const { form, errors, constraints, enhance, delayed } = superForm(data.form, {
		onChange() {
			if (Object.keys($errors).length === 0) return
			errors.clear()
		}
	})
</script>

<section>
	<div class="flex gap-4">
		<SpendingRadial spent={expenses} limit={data.budget.amount} />

		<div class="card inline-block p-4">
			<form class="flex h-full flex-col" method="post" use:enhance>
				<div class="min-h-24">
					<label class="label">
						<span>Amount</span>
						<input
							disabled={$delayed}
							class="input"
							class:input-error={$errors.amount}
							type="number"
							name="amount"
							aria-invalid={$errors.amount ? "true" : undefined}
							bind:value={$form.amount}
							{...$constraints.amount}
						/>
					</label>
					{#if $errors.amount}
						<FormError message={$errors.amount} />
					{/if}
				</div>
				<button disabled={$delayed} class="variant-filled btn mt-4">
					{#if $delayed}
						<LoadingSpinner width="w-6" />
					{:else}
						<span>Submit </span>
					{/if}
				</button>
			</form>
		</div>
	</div>

	<TransactionsList transactions={data.transactions} />
</section>
