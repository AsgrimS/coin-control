<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="mt-12 flex justify-center">
	<div class="card inline-block p-8">
		<form class="flex flex-col gap-4" method="post" use:enhance>
			<label class="label">
				<span>Username</span>
				<input class="input" type="text" name="username" />
			</label>
			<label class="label mt-2">
				<span>Password</span>
				<input class="input" type="password" name="password" />
			</label>
			<label class="label">
				<span>Repeat Password</span>
				<input class="input" type="password" name="repeat-password" />
			</label>
			<button class="variant-filled btn mt-6">Sign Up</button>
		</form>
	</div>
</div>
