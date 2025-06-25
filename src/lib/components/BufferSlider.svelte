<script lang="ts">
	import { slide } from 'svelte/transition';

	import * as Card from '$lib/components/ui/card/index.js';
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
				<div class="flex place-content-center w-full overflow-auto">
					<ToggleGroup.Root
						type="single"
						size="lg"
						onValueChange={(e) => bufferSize.setValue(+e)}
						value="1"
						class="border"
					>
						{#each [0.5, 1, 2, 3, 4, 5, 10, 20] as step}
							<ToggleGroup.Item value={step.toString()} aria-label={`Toggle ${step.toString()}`}>
								<p class="text-md sm:text-lg font-semibold sm:px-2">{step.toString()}</p>
							</ToggleGroup.Item>
						{/each}
					</ToggleGroup.Root>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{/if}
