<script lang="ts">
	import { PMTilesProtocol } from '@svelte-maplibre-gl/pmtiles';
	import { Map } from 'maplibre-gl';
	import { onMount } from 'svelte';
	import {
		GeoJSONSource,
		GlobeControl,
		LineLayer,
		MapLibre,
		NavigationControl,
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
			console.log(response);
			console.log(response.headers.get('X-Sw-Tag'));

			if (
				response.status === 202 &&
				response.headers.get('X-Sw-Tag') === 'Served by Service Worker'
			) {
				console.log('Service worker is active');
				swReady = true;
			} else {
				console.log('Service worker is not active, reloading the page...');
				window.location.reload();
				location.reload();
			}
		} catch (error) {
			console.error('Error checking service worker:', error);
			window.location.reload();
			location.reload();
		}
	});

	$effect(() => {
		if (route?.file() !== null) {
			let statistics = route.file()?.[0].getStatistics();

			// TODO
			// map?.fitBounds(statistics?.global.bounds, {
			// 	padding: 40
			// });
		}
	});
</script>

<PMTilesProtocol />

{#if swReady}
	<MapLibre
		bind:map
		class="h-[55vh] min-h-[200px] rounded-lg"
		zoom={10}
		center={[2.333333, 48.866667]}
		{style}
	>
		<NavigationControl />
		<ScaleControl />
		<GlobeControl />
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
