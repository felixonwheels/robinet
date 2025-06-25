<script lang="ts">
	import { PMTilesProtocol } from '@svelte-maplibre-gl/pmtiles';
	import { LngLat, LngLatBounds, Map } from 'maplibre-gl';
	import {
		GeoJSONSource,
		GlobeControl,
		LineLayer,
		MapLibre,
		NavigationControl,
		Projection,
		ScaleControl
	} from 'svelte-maplibre-gl';

	import { route } from '$lib/state/route.svelte';
	import { style } from '$lib/style';

	let map: Map | undefined = $state();

	$effect(() => {
		if (route?.file() !== null) {
			let bounds = route.file()?.[0].getStatistics().global.bounds;

			let sw = new LngLat(bounds?.southWest.lon ?? 0, bounds?.southWest.lat ?? 0);
			let ne = new LngLat(bounds?.northEast.lon ?? 0, bounds?.northEast.lat ?? 0);
			let llb = new LngLatBounds(sw, ne);

			map?.fitBounds(llb, {
				padding: 40,
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
	{#each route.file()?.[0].trk ?? [] as track}
		<GeoJSONSource
			data={{
				type: 'LineString',
				coordinates: track
					.getTrackPoints()
					.map((point) => [point.attributes.lon, point.attributes.lat])
			}}
		>
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
</MapLibre>
