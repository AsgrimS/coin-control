<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="mt-12 flex justify-center">
	<div class="card inline-block p-4">
		<header class="card-header text-center font-bold">Signup</header>
		<section class="p-4">
			<form class="flex flex-col gap-4" method="post" use:enhance>
				<label class="label">
					<span>Username</span>
					<input class="input" type="text" name="username" />
				</label>
				<label class="label">
					<span>Password</span>
					<input class="input" type="password" name="password" />
				</label>
				<button type="button" class="variant-filled btn">Continue</button>
			</form>
		</section>
	</div>
</div>
