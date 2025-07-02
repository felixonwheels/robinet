<script lang="ts">
	import GithubLogo from '$lib/components/GithubLogo.svelte';
	import { m } from '$lib/paraglide/messages';
</script>

<div class="space-y-4">
	<p>
		{m.titleLead()}
	</p>

	<div class="flex place-content-center">
		<a href="https://github.com/felixonwheels/robinet" target="_blank">
			<div class="size-12">
				<GithubLogo />
			</div>
		</a>
	</div>
</div>
