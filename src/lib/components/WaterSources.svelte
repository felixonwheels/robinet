<script lang="ts">
	import { CustomControl, Marker } from 'svelte-maplibre-gl';

	import { api } from '$lib/api';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import { m } from '$lib/paraglide/messages';
	import { overpassPolygons, selectedWaterSources, waterSources } from '$lib/state.svelte';

	$effect(() => {
		(async () => {
			if (overpassPolygons.value.length) {
				const waterSourcesResp = await api().getWaterSources(overpassPolygons.value);

				waterSources.setValue(waterSourcesResp);
				selectedWaterSources.setSelectedWaterSources(waterSourcesResp);
			}
		})();
	});
</script>

{#if !!selectedWaterSources.value?.size}
	<CustomControl position="top-left">
		<div class="p-2 text-sm font-sans text-gray-800">
			{selectedWaterSources.value?.size}
			{m.waterSourceCount({ count: selectedWaterSources.value?.size })}
		</div>
	</CustomControl>
{/if}

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
