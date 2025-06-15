<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import '../app.css';

	let { children } = $props();
</script>

<ModeWatcher />

<Toaster />

<div class="w-full p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-screen-sm">
		{@render children()}
	</div>
</div>
