<script lang="ts">
	import { slide } from 'svelte/transition';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { m } from '$lib/paraglide/messages';
	import { file } from '$lib/state.svelte';
	import { bufferSize } from '$lib/state.svelte';
</script>

{#if file.value !== null}
	<div transition:slide>
		<Card.Root class="w-full ">
			<Card.Header>
				<Card.Title class="text-center">{m.bufferSize()}</Card.Title>
			</Card.Header>

			<Card.Content>
				<div class="flex place-content-center w-full">
					<ToggleGroup.Root
						type="single"
						size="lg"
						onValueChange={(e) => bufferSize.setValue(+e)}
						value="10"
						class="border"
					>
						{#each [0.2, 0.5, 0.8, 1, 2, 3, 4, 5, 10, 15, 20] as step}
							<ToggleGroup.Item value={step.toString()} aria-label={`Toggle ${step.toString()}`}>
								<p class="text-md font-semibold sm:px-2">{step.toString()}</p>
							</ToggleGroup.Item>
						{/each}
					</ToggleGroup.Root>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{/if}
