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
		NavigationControl,
		Projection,
		ScaleControl
	} from 'svelte-maplibre-gl';

	import { file, tracks, tracksBuffers } from '$lib/state.svelte';
	import { style } from '$lib/style';

	let map: Map | undefined = $state();

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
</MapLibre>
