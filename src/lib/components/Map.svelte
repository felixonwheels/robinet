<script lang="ts">
	import { CircleDashed } from '@lucide/svelte';
	import { PMTilesProtocol } from '@svelte-maplibre-gl/pmtiles';
	import type { Feature, MultiPolygon, Polygon } from 'geojson';
	import { LngLat, LngLatBounds, Map } from 'maplibre-gl';
	import { mode } from 'mode-watcher';
	import {
		CustomControl,
		FillLayer,
		FullScreenControl,
		GeoJSONSource,
		GlobeControl,
		LineLayer,
		MapLibre,
		Marker,
		NavigationControl,
		Projection
	} from 'svelte-maplibre-gl';
	import { fade } from 'svelte/transition';

	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as HoverCard from '$lib/components/ui/hover-card/index.js';
	import { m } from '$lib/paraglide/messages';
	import {
		bufferSize,
		file,
		overpassPolygons,
		selectedWaterSources,
		tracks,
		tracksBuffers,
		waterSources
	} from '$lib/state.svelte';
	import { styleDark, styleLight } from '$lib/style';
	import type { WaterSource } from '$lib/types';

	let map: Map | undefined = $state();
	let style = $derived(mode.current === 'dark' ? styleDark : styleLight);

	let selectedBufferSize = $state('1');
	let bufferSizeDropdownOpened = $state(false);

	$effect(() => {
		if (file.value !== null) {
			let bounds = file.value?.[0].getStatistics().global.bounds;

			let sw = new LngLat(bounds?.southWest.lon ?? 0, bounds?.southWest.lat ?? 0);
			let ne = new LngLat(bounds?.northEast.lon ?? 0, bounds?.northEast.lat ?? 0);
			let llb = new LngLatBounds(sw, ne);

			map?.fitBounds(llb, {
				padding: 80,
				animate: true
			});
		}
	});

	$effect(() => {
		(async () => {
			if (overpassPolygons.value.length) {
				try {
					const query = `
					[out:json][timeout:60];

					(
					node["amenity"="drinking_water"](poly:"${overpassPolygons.value}");
					way["amenity"="drinking_water"](poly:"${overpassPolygons.value}");
					relation["amenity"="drinking_water"](poly:"${overpassPolygons.value}");

					node["amenity"="toilets"]["drinking_water"~"^(yes|designated)$"](poly:"${overpassPolygons.value}");
					way["amenity"="toilets"]["drinking_water"~"^(yes|designated)$"](poly:"${overpassPolygons.value}");
					relation["amenity"="toilets"]["drinking_water"~"^(yes|designated)$"](poly:"${overpassPolygons.value}");

					node["man_made"="water_tap"]["drinking_water"~"^(yes|designated)$"](poly:"${overpassPolygons.value}");
					way["man_made"="water_tap"]["drinking_water"~"^(yes|designated)$"](poly:"${overpassPolygons.value}");

					node["natural"="spring"]["drinking_water"~"^(yes|designated)$"](poly:"${overpassPolygons.value}");
					node["amenity"="fountain"]["drinking_water"~"^(yes|designated)$"](poly:"${overpassPolygons.value}");

					node["man_made"="standpipe"]["drinking_water"~"^(yes|designated)$"](poly:"${overpassPolygons.value}");
					);
					
					out center;
					`;

					const url = 'https://overpass-api.de/api/interpreter';

					const res = await fetch(url, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						body: new URLSearchParams({ data: query }).toString()
					});
					const data = await res.json();

					waterSources.setValue(data.elements as WaterSource[]);
					selectedWaterSources.setSelectedWaterSources(data.elements as WaterSource[]);
				} catch (error) {
					console.error('Error:', error);
				}
			}
		})();
	});

	$effect(() => {
		if (selectedBufferSize !== null) {
			bufferSize.setValue(+selectedBufferSize);
		}
	});
</script>

<PMTilesProtocol />

<Card.Root class="w-full p-0">
	<Card.Content class="p-0">
		<MapLibre bind:map class="h-[55vh] rounded-xl" zoom={1} maxZoom={18} {style}>
			<NavigationControl />
			<GlobeControl />
			<Projection type="globe" />
			<FullScreenControl position="top-right" />
			{#each tracks.value as track}
				<GeoJSONSource data={track}>
					<LineLayer
						paint={{
							'line-color': '#2e86de',
							'line-width': 2
						}}
						layout={{
							'line-join': 'round',
							'line-cap': 'round'
						}}
					/>
				</GeoJSONSource>
			{/each}
			{#each tracksBuffers.value as tracksBuffer}
				{#if tracksBuffer !== undefined}
					<GeoJSONSource data={tracksBuffer as Feature<Polygon | MultiPolygon>}>
						<FillLayer
							paint={{
								'fill-color': '#00ff55',
								'fill-opacity': 0.1
							}}
						/>
						<LineLayer
							paint={{
								'line-color': '#00ff55',
								'line-width': 1
							}}
						/>
					</GeoJSONSource>
				{/if}
			{/each}
			{#if file.value !== null}
				<div transition:fade>
					<CustomControl position="bottom-left">
						<DropdownMenu.Root open={bufferSizeDropdownOpened}>
							<DropdownMenu.Trigger>
								{#snippet child({ props })}
									<Button
										{...props}
										variant="outline"
										size="icon"
										class="flex! items-center justify-center text-gray-900"
									>
										<CircleDashed color="#00ff55" strokeWidth={3} />
									</Button>
								{/snippet}
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Group>
									<DropdownMenu.Label>{m.bufferSize()}</DropdownMenu.Label>
									<DropdownMenu.Separator />
									<DropdownMenu.RadioGroup bind:value={selectedBufferSize}>
										{#each [0.5, 1, 2, 3, 4, 5, 10, 20] as step}
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
		</MapLibre>
	</Card.Content>
</Card.Root>
