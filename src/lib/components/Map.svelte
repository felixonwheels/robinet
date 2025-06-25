<script lang="ts">
	import { PMTilesProtocol } from '@svelte-maplibre-gl/pmtiles';
	import type { Feature, MultiPolygon, Polygon } from 'geojson';
	import { LngLat, LngLatBounds, Map } from 'maplibre-gl';
	import {
		FillLayer,
		GeoJSONSource,
		GlobeControl,
		LineLayer,
		MapLibre,
		Marker,
		NavigationControl,
		Popup,
		Projection,
		ScaleControl
	} from 'svelte-maplibre-gl';

	import { file, overpassPolygons, tracks, tracksBuffers, waterSources } from '$lib/state.svelte';
	import { style } from '$lib/style';

	let map: Map | undefined = $state();
	let openedPopup: number | null = $state(null);

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
					[out:json][timeout:25];
					(node["amenity"="drinking_water"](poly:"${overpassPolygons.value}");
					way["amenity"="drinking_water"](poly:"${overpassPolygons.value}");
					relation["amenity"="drinking_water"](poly:"${overpassPolygons.value}"););
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
				} catch (error) {
					console.error('Error:', error);
				}
			}
		})();
	});
</script>

<PMTilesProtocol />

<MapLibre bind:map class="h-[55vh] rounded-lg" zoom={1} maxZoom={18} {style}>
	<NavigationControl />
	<ScaleControl />
	<GlobeControl />
	<Projection type="globe" />
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
	{#if waterSources.value !== null}
		{#each waterSources.value as waterSource}
			<Marker lnglat={{ lng: waterSource.lon, lat: waterSource.lat }}>
				{#snippet content()}
					<div class="text-center leading-none">
						<div class="text-xl">💧</div>
					</div>
				{/snippet}
				<Popup
					class="text-black"
					open={waterSource.id === openedPopup}
					onopen={() => (openedPopup = waterSource.id)}
					onclose={() => (openedPopup = null)}
				>
					<span class="text-lg">{waterSource.tags.amenity}</span>
				</Popup>
			</Marker>
		{/each}
	{/if}
</MapLibre>
