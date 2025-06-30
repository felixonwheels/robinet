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
	<div class="mb-8">
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
				<div transition:slide class="w-full p-4 sm:p-6 lg:p-8">
					<div class="mx-auto max-w-screen-sm">
						<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
							{m.titleLead()}
						</h3>
						<p>
							{m.titleDesc()}
						</p>
					</div>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</div>
{/if}
