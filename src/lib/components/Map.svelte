<script lang="ts">
	import { PMTilesProtocol } from '@svelte-maplibre-gl/pmtiles';
	import { LngLat, LngLatBounds, Map } from 'maplibre-gl';
	import { onMount } from 'svelte';
	import {
		GeoJSONSource,
		GlobeControl,
		LineLayer,
		MapLibre,
		NavigationControl,
		Projection,
		ScaleControl
	} from 'svelte-maplibre-gl';

	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { route } from '$lib/state/route.svelte';
	import { style } from '$lib/style';

	let swReady = $state(false);

	let map: Map | undefined = $state();

	onMount(async () => {
		try {
			const response = await fetch('/checkSw');

			if (
				response.status === 202 &&
				response.headers.get('X-Sw-Tag') === 'Served by Service Worker'
			) {
				swReady = true;
			} else {
				window.location.reload();
				location.reload();
			}
		} catch (error) {
			window.location.reload();
			location.reload();
		}
	});

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

{#if swReady}
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
{:else}
	<Skeleton class="h-[55vh] min-h-[200px] rounded-lg" />
{/if}
