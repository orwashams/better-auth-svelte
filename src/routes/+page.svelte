<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';

	async function handleSignOut() {
		const result = await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto('/auth');
				}
			}
		});

		console.log(result.data?.success);
	}
</script>

<div class="flex h-screen flex-col items-center justify-center gap-16">
	<h1 class="text-4xl font-bold">YOU ARE AUTHENTICATED!!</h1>

	<button
		class="rounded-xl bg-zinc-900 px-8 py-4 text-2xl font-bold text-white hover:bg-zinc-700"
		onclick={handleSignOut}
	>
		Sign Out
	</button>
</div>
