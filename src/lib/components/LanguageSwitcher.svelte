<script lang="ts">
	import { GlobeIcon } from '@lucide/svelte';

	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { m } from '$lib/paraglide/messages';
	import { type Locale, getLocale, setLocale } from '$lib/paraglide/runtime';

	let value = $state(getLocale());

	const languages = [
		{ code: 'en', label: '🇬🇧' },
		{ code: 'fr', label: '🇫🇷' }
	];

	function onChange(locale: string) {
		if (locale !== getLocale() && !!locale) {
			setLocale(locale as Locale);
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({ variant: 'outline', size: 'icon' })}
		aria-label={m.languageSwitcher()}
	>
		<GlobeIcon class="size-4" />
		<span class="sr-only">{m.languageSwitcher()}</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.RadioGroup bind:value onValueChange={onChange}>
			{#each languages as language (language.code)}
				<DropdownMenu.RadioItem value={language.code}>
					{language.label}
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
