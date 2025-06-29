<script lang="ts">
	import { Info } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
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
	<Drawer.Root>
		<div transition:slide>
			<div class="flex place-content-center justify-between">
				<h2
					class="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight transition-colors first:mt-0"
				>
					💧 robinet
				</h2>
				<div class="space-x-1">
					<Drawer.Trigger>
						<Button size="icon" variant="outline">
							<Info class="size-4" />
						</Button>
					</Drawer.Trigger>

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
		</div>

		<Drawer.Content>
			<div transition:slide>
				<blockquote class="m-4 border-l-2 pl-6 text-muted-foreground text-l my-12">
					{m.titleLead()}
				</blockquote>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
