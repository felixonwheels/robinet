<script>
	import { slide } from 'svelte/transition';

	import { m } from '$lib/paraglide/messages';
	import { file } from '$lib/state.svelte';
</script>

{#if file.value === null}
	<div transition:slide>
		<h2 class="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0">
			💧 robinet
		</h2>
	</div>

	<div transition:slide>
		<p class="text-muted-foreground text-l">
			{m.titleLead()}
		</p>
	</div>
{/if}
