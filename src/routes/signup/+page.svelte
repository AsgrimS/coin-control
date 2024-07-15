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
						class:input-error={$errors.username}
						type="text"
						name="username"
						aria-invalid={$errors.username ? "true" : undefined}
						bind:value={$form.username}
						{...$constraints.username}
					/>
				</label>
				{#if $errors.username}
					<FormError message={$errors.username} />
				{/if}
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
			</div>
			<div class="min-h-24">
				<label class="label">
					<span>Repeat Password</span>
					<input
						class="input"
						class:input-error={$errors.repeatPassword}
						type="password"
						name="repeatPassword"
						aria-invalid={$errors.repeatPassword ? "true" : undefined}
						bind:value={$form.repeatPassword}
						{...$constraints.repeatPassword}
					/>
				</label>
				{#if $errors.repeatPassword && !isRateLimited}
					<FormError message={$errors.repeatPassword} />
				{/if}
				{#if isRateLimited}
					<FormError message="You've attempted to register too many times" />
				{/if}
			</div>
			<button class="variant-filled btn mt-4">Sign Up</button>
		</form>
		<hr class="my-4" />

		<p class="text-surface-400">
			Already have an account?<a class="anchor ml-2" href="/login">Login</a>
		</p>
	</div>
</div>
