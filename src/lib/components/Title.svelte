<script lang="ts">
	import { Info } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { m } from '$lib/paraglide/messages';
	import { file } from '$lib/state.svelte';
</script>

{#if file.value === undefined}
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

						<LanguageSwitcher />

						<ThemeSwitcher />
					</div>
				</div>
			</div>

			<Drawer.Content>
				<div transition:slide class="w-full p-4 sm:p-6 lg:p-8">
					<div class="mx-auto max-w-screen-sm">
						<p>
							{m.titleLead()}
						</p>
					</div>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</div>
{/if}
