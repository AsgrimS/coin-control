<script lang="ts">
	import { superForm } from "sveltekit-superforms"
	import type { PageData } from "./$types"
	import FormError from "$lib/components/FormError.svelte"

	export let data: PageData
	let isRateLimited = false

	const { form, errors, constraints, enhance } = superForm(data.form, {
		onChange() {
			if (Object.keys($errors).length === 0) return
			errors.clear()
			isRateLimited = false
		},
		onError(error) {
			if (error.result.status === 429) isRateLimited = true
		}
	})
</script>

<div class="mt-12 flex justify-center">
	<div class="card inline-block p-8">
		<form class="flex flex-col" method="post" use:enhance>
			<div class="min-h-24">
				<label class="label">
					<span>Username</span>
					<input
						class="input"
						class:input-error={$errors.password}
						type="text"
						name="username"
						aria-invalid={$errors.username ? "true" : undefined}
						bind:value={$form.username}
						{...$constraints.username}
					/>
				</label>
			</div>
			<div class="min-h-24">
				<label class="label">
					<span>Password</span>
					<input
						class="input"
						class:input-error={$errors.password}
						type="password"
						name="password"
						aria-invalid={$errors.password ? "true" : undefined}
						bind:value={$form.password}
						{...$constraints.password}
					/>
				</label>
				{#if $errors.password && !isRateLimited}
					<FormError message={$errors.password} />
				{/if}
				{#if isRateLimited}
					<FormError message="You've attempted to login too many times" />
				{/if}
			</div>
			<button class="variant-filled btn mt-4">Login</button>
		</form>
	</div>
</div>
