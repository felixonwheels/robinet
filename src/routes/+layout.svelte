<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	import { page } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { m } from '$lib/paraglide/messages';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="description" content={m.titleLead()} />
	<meta property="og:title" content="robinet" />
	<meta property="og:description" content={m.titleLead()} />
	<meta property="og:image" content="https://fav.farm/💧" />
</svelte:head>

<ModeWatcher />

<Toaster />

<div class="w-full p-4 sm:p-6 lg:p-8">
	<div class="mx-auto max-w-screen-sm">
		{@render children()}
	</div>
</div>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
