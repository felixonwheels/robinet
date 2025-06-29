<script lang="ts">
	import { onMount } from 'svelte';
	import { CustomControl, Marker } from 'svelte-maplibre-gl';

	import { api } from '$lib/api';
	import Spinner from '$lib/components/Spinner.svelte';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { m } from '$lib/paraglide/messages';
	import { overpassPolygons, selectedWaterSources, waterSources } from '$lib/state.svelte';

	let controller = new AbortController();
	let signal = controller.signal;

	let promise = $state(
		api()
			.getWaterSources(overpassPolygons.value, signal)
			.then((waterSourcesResp) => {
				waterSources.setValue(waterSourcesResp);
				selectedWaterSources.setSelectedWaterSources(waterSourcesResp);

				return waterSourcesResp;
			})
	);

	onMount(() => {
		return () => {
			waterSources.setValue(null);
			selectedWaterSources.setSelectedWaterSources(null);

			controller.abort();
		};
	});
</script>

<CustomControl position="top-left">
	<div>
		{#await promise}
			<div class="p-1">
				<Spinner />
			</div>
		{:then _}
			<div class="p-2 text-sm font-sans text-gray-800">
				{selectedWaterSources.value?.size ?? 0}
				{m.waterSourceCount({ count: selectedWaterSources.value?.size ?? 0 })}
			</div>
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</div>
</CustomControl>

{#if waterSources.value?.length}
	{#each waterSources.value as waterSource}
		{#if !(isNaN(waterSource.lon) || isNaN(waterSource.lat))}
			<Marker lnglat={{ lng: waterSource.lon, lat: waterSource.lat }}>
				{#snippet content()}
					<HoverCard.Root>
						<HoverCard.Trigger>
							<div class="text-center leading-none">
								<div
									role="button"
									tabindex="0"
									class="text-xl"
									onclick={() => selectedWaterSources.toggleWaterSource(waterSource.id)}
									onkeydown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											selectedWaterSources.toggleWaterSource(waterSource.id);
										}
									}}
								>
									{#if selectedWaterSources.value?.has(waterSource.id)}
										<span>💧</span>
									{:else}
										<span class="grayscale">💧</span>
									{/if}
								</div>
							</div>
						</HoverCard.Trigger>
						<HoverCard.Content>
							<div>
								{#each Object.entries(waterSource.tags) as [key, value]}
									<p class="text-lg">{key} => {value}</p>
								{/each}
							</div>
						</HoverCard.Content>
					</HoverCard.Root>
				{/snippet}
			</Marker>
		{/if}
	{/each}
{/if}
