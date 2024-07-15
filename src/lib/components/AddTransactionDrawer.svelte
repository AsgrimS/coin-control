<script lang="ts">
	import { getDrawerStore } from "@skeletonlabs/skeleton"
	import { superForm, type SuperValidated } from "sveltekit-superforms"
	import ArrowDownIcon from "~icons/tabler/arrow-down"
	import LoadingSpinner from "./LoadingSpinner.svelte"
	import { onMount } from "svelte"

	const drawerStore = getDrawerStore()

	type CreateTransactionForm = SuperValidated<{ amount: number; title: string | null }>

	const { form, errors, constraints, enhance, delayed } = superForm(
		$drawerStore.meta.createTransactionForm as CreateTransactionForm,
		{
			onChange() {
				if (Object.keys($errors).length === 0) return
				errors.clear()
			},

			onResult({ result }) {
				if (result.type === "success") {
					drawerStore.close()
				}
			}
		}
	)

	let amountInputRef: HTMLInputElement

	onMount(() => {
		amountInputRef.focus()
	})
</script>

<section class="flex h-full flex-col p-4 pt-1">
	<button class="btn-icon mx-auto h-8 w-full" on:click={() => drawerStore.close()}>
		<ArrowDownIcon />
	</button>
	<form
		class="flex h-full flex-col"
		method="post"
		action={`?/${$drawerStore.meta.createTransactionFormActionName}`}
		use:enhance
	>
		<div class="min-h-24">
			<label class="label">
				<span>Amount</span>
				<input
					inputmode="decimal"
					disabled={$delayed}
					class="input"
					class:input-error={$errors.amount}
					type="number"
					name="amount"
					aria-invalid={$errors.amount ? "true" : undefined}
					bind:value={$form.amount}
					bind:this={amountInputRef}
					{...$constraints.amount}
				/>
			</label>
		</div>
		<div class="min-h-24">
			<label class="label">
				<span class="">
					Title <span class="text-surface-400">
						(optional)
						<span />
					</span>
					<input
						disabled={$delayed}
						class="input"
						class:input-error={$errors.title}
						type="text"
						name="title"
						aria-invalid={$errors.title ? "true" : undefined}
						bind:value={$form.title}
						{...$constraints.title}
					/>
				</span>
			</label>
		</div>
		<button disabled={$delayed} class="variant-filled btn mt-auto">
			{#if $delayed}
				<LoadingSpinner width="w-6" />
			{:else}
				<span>Add Expense</span>
			{/if}
		</button>
	</form>
</section>
