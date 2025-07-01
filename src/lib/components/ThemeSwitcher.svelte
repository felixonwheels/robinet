<script lang="ts">
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { type SystemModeValue, mode, resetMode, setMode } from 'mode-watcher';

	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { m } from '$lib/paraglide/messages';

	let value = $state(mode.current);

	function onChange(mode: string) {
		switch (mode) {
			case 'light':
			case 'dark':
				setMode(mode);
				break;
			default:
				resetMode();
				break;
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<SunIcon class="scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
		<MoonIcon class="absolute scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
		<span class="sr-only">{m.themeSelectorToggle()}</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.RadioGroup bind:value onValueChange={onChange}>
			<DropdownMenu.RadioItem value="light">
				{m.themeSelectorLight()}
			</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="dark">
				{m.themeSelectorDark()}
			</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="system">
				{m.themeSelectorSystem()}
			</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>

		<!-- <DropdownMenu.Item onclick={() => setMode('light')}>{m.themeSelectorLight()}</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => setMode('dark')}>{m.themeSelectorDark()}</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => resetMode()}>{m.themeSelectorSystem()}</DropdownMenu.Item> -->
	</DropdownMenu.Content>
</DropdownMenu.Root>
