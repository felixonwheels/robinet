<script lang="ts">
	import { booleanPointInPolygon } from '@turf/turf';
	import type { Polygon } from 'geojson';
	import { onMount } from 'svelte';
	import { CustomControl, Marker, Popup } from 'svelte-maplibre-gl';

	import { api } from '$lib/api';
	import Spinner from '$lib/components/Spinner.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
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

	let hoveredMarker = $state<number>();
	let hoverTimeout: ReturnType<typeof setTimeout>;

	let promise = $state(
		api()
			.getWaterSources(overpassPolygons.value ?? [], signal)
			.then((waterSourcesResp) => {
				const trueWaterSources = waterSourcesResp.filter((source) =>
					booleanPointInPolygon([source.lon, source.lat], tracksBuffers.value?.geometry as Polygon)
				);

				waterSources.value = trueWaterSources;
				selectedWaterSources.setSelectedWaterSources(trueWaterSources);

				return trueWaterSources;
			})
	);

	onMount(() => {
		return () => {
			waterSources.value = undefined;
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
					<div
						role="button"
						tabindex="0"
						class="text-center leading-none text-xl"
						onmouseenter={() => {
							clearTimeout(hoverTimeout);
							hoveredMarker = waterSource.id;
						}}
						onmouseleave={() => {
							hoverTimeout = setTimeout(() => (hoveredMarker = undefined), 150);
						}}
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
				{/snippet}
				{#if hoveredMarker === waterSource.id}
					<Popup
						open={true}
						closeButton={false}
						closeOnClick={false}
						lnglat={{ lng: waterSource.lon, lat: waterSource.lat }}
					>
						<div
							role="application"
							onmouseenter={() => {
								clearTimeout(hoverTimeout);
								hoveredMarker = waterSource.id;
							}}
							onmouseleave={() => {
								hoverTimeout = setTimeout(() => (hoveredMarker = undefined), 150);
							}}
						>
							<Card.Root>
								<Card.Content>
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
								</Card.Content>
							</Card.Root>
						</div>
					</Popup>
				{/if}
			</Marker>
		{/if}
	{/each}
{/if}
