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
			<button class="variant-filled btn mt-6">Login</button>
		</form>
	</div>
</div>
