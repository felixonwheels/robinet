<script lang="ts">
	import { PMTilesProtocol } from '@svelte-maplibre-gl/pmtiles';
	import { onMount } from 'svelte';
	import { GlobeControl, MapLibre, NavigationControl, ScaleControl } from 'svelte-maplibre-gl';

	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { style } from '$lib/style';

	let swReady = $state(false);

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
</script>

<PMTilesProtocol />

{#if swReady}
	<MapLibre
		class="h-[55vh] min-h-[200px] rounded-2xl"
		zoom={10}
		center={[2.333333, 48.866667]}
		{style}
		><NavigationControl />
		<ScaleControl />
		<GlobeControl />
	</MapLibre>
{:else}
	<Skeleton class="h-[55vh] min-h-[200px] rounded-2xl" />
{/if}
