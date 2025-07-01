<script lang="ts">
	import { booleanPointInPolygon } from '@turf/turf';
	import type { Polygon } from 'geojson';
	import { onMount } from 'svelte';
	import { CustomControl, Marker } from 'svelte-maplibre-gl';

	import { api } from '$lib/api';
	import Spinner from '$lib/components/Spinner.svelte';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { m } from '$lib/paraglide/messages';
	import {
		overpassPolygons,
		selectedWaterSources,
		tracksBuffers,
		waterSources
	} from '$lib/state.svelte';

	let controller = new AbortController();
	let signal = controller.signal;

	let promise = $state(
		api()
			.getWaterSources(overpassPolygons.value ?? [], signal)
			.then((waterSourcesResp) => {
				const trueWaterSources = waterSourcesResp.filter((source) =>
					booleanPointInPolygon([source.lon, source.lat], tracksBuffers.value?.geometry as Polygon)
				);

				waterSources.setValue(trueWaterSources);
				selectedWaterSources.setSelectedWaterSources(trueWaterSources);

				return trueWaterSources;
			})
	);

	onMount(() => {
		return () => {
			waterSources.setValue(undefined);
			selectedWaterSources.setSelectedWaterSources(undefined);

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
			<div
				class="p-2 text-sm font-sans dark:bg-muted-foreground dark:text-primary-foreground rounded"
			>
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
							<Table.Root>
								<Table.Caption>{m.waterSourceInfo()}</Table.Caption>
								<Table.Body>
									{#each Object.entries(waterSource.tags) as [key, value]}
										<Table.Row>
											<Table.Cell class="font-medium">{key}</Table.Cell>
											<Table.Cell>{value}</Table.Cell>
										</Table.Row>
									{/each}
								</Table.Body>
							</Table.Root>
							<div></div>
						</HoverCard.Content>
					</HoverCard.Root>
				{/snippet}
			</Marker>
		{/if}
	{/each}
{/if}
