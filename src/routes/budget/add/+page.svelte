<script lang="ts">
	import { superForm } from "sveltekit-superforms"
	import type { PageData } from "./$types"
	import FormError from "$lib/components/FormError.svelte"
	import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton"

	export let data: PageData

	const { form, errors, constraints, enhance } = superForm(data.form, {
		dataType: "json",
		onChange() {
			if (Object.keys($errors).length === 0) return
			errors.clear()
		}
	})
</script>

<div class="mt-12 flex justify-center">
	<div class="card inline-block p-8">
		<form class="flex h-full flex-col" method="post" use:enhance>
			<div class="min-h-24">
				<label class="label">
					<span>Amount</span>
					<input
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
			<div class="min-h-24">
				<label class="label flex flex-col" for="frequency-radio">
					<span>Frequency</span>
					<RadioGroup id="frequency-radio">
						<RadioItem bind:group={$form.resetFrequency} name={"resetFrequency"} value="weekly">
							Weekly
						</RadioItem>
						<RadioItem bind:group={$form.resetFrequency} name={"resetFrequency"} value="monthly">
							Monthly
						</RadioItem>
					</RadioGroup>
				</label>
			</div>
			<button class="variant-filled btn mt-4">Create Budget</button>
		</form>
	</div>
</div>
