<script lang="ts">
	import { slide } from 'svelte/transition';

	import { LanguageSwitcher } from '$lib/components/ui/language-switcher';
	import { m } from '$lib/paraglide/messages';
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import type { Locale } from '$lib/paraglide/runtime';
	import { file } from '$lib/state.svelte';

	let value = $state(getLocale());

	const languages = [
		{ code: 'en', label: '🇬🇧' },
		{ code: 'fr', label: '🇫🇷' }
	];
</script>

{#if file.value === null}
	<div transition:slide>
		<div class="flex place-content-center justify-between">
			<h2
				class="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				💧 robinet
			</h2>
			<LanguageSwitcher
				{languages}
				onChange={(locale) => {
					if (locale !== getLocale() && !!locale) {
						setLocale(locale as Locale);
					}
				}}
				bind:value
			/>
		</div>
	</div>

	<div transition:slide>
		<p class="text-muted-foreground text-l">
			{m.titleLead()}
		</p>
	</div>
{/if}
