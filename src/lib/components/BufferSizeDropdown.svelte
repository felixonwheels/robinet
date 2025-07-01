<script lang="ts">
	import { CircleDashed } from '@lucide/svelte';
	import { CustomControl } from 'svelte-maplibre-gl';
	import { fade } from 'svelte/transition';

	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { m } from '$lib/paraglide/messages';
	import { bufferSize, file } from '$lib/state.svelte';

	let selectedBufferSize = $state('1');
	let bufferSizeDropdownOpened = $state(false);
</script>

{#if file.value !== undefined}
	<div transition:fade>
		<CustomControl position="bottom-left">
			<DropdownMenu.Root open={bufferSizeDropdownOpened}>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="outline"
							size="icon"
							class="flex! items-center justify-center rounded"
						>
							<CircleDashed color="#00ff55" strokeWidth={2} />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>{m.bufferSize()}</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.RadioGroup
							onValueChange={(selectedBufferSize) => {
								bufferSize.setValue(+selectedBufferSize);
							}}
							bind:value={selectedBufferSize}
						>
							{#each [0.5, 1, 2, 5, 10] as step}
								<DropdownMenu.RadioItem value={step.toString()}>
									{step} km
								</DropdownMenu.RadioItem>
							{/each}
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</CustomControl>
	</div>
{/if}
