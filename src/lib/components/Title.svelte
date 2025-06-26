<script lang="ts">
	import { slide } from 'svelte/transition';

	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { m } from '$lib/paraglide/messages';
	import { getLocale, locales, setLocale } from '$lib/paraglide/runtime';
	import type { Locale } from '$lib/paraglide/runtime';
	import { file } from '$lib/state.svelte';

	const flags = { en: '🇬🇧', fr: '🇫🇷' };
</script>

{#if file.value === null}
	<div transition:slide>
		<div class="flex place-content-center justify-between">
			<h2
				class="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				💧 robinet
			</h2>
			<ToggleGroup.Root
				type="single"
				size="lg"
				variant="outline"
				onValueChange={(e) => setLocale(e as Locale)}
				value={getLocale()}
			>
				{#each locales as locale}
					<ToggleGroup.Item value={locale} aria-label={`Toggle ${locale}`}>
						<p class="text-md sm:text-lg font-semibold sm:px-2">{flags[locale]}</p>
					</ToggleGroup.Item>
				{/each}
			</ToggleGroup.Root>
		</div>
	</div>

	<div transition:slide>
		<p class="text-muted-foreground text-l">
			{m.titleLead()}
		</p>
	</div>
{/if}
