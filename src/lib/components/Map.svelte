<script lang="ts">
	import { PMTilesProtocol } from '@svelte-maplibre-gl/pmtiles';
	import { LngLat, LngLatBounds, Map } from 'maplibre-gl';
	import { mode } from 'mode-watcher';
	import {
		FullScreenControl,
		GlobeControl,
		MapLibre,
		NavigationControl,
		Projection
	} from 'svelte-maplibre-gl';

	import BufferSizeDropdown from '$lib/components/BufferSizeDropdown.svelte';
	import Tracks from '$lib/components/Tracks.svelte';
	import WaterSources from '$lib/components/WaterSources.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { file } from '$lib/state.svelte';
	import { styleDark, styleLight } from '$lib/style';

	let map: Map | undefined = $state();
	let style = $derived(mode.current === 'dark' ? styleDark : styleLight);

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

<Card.Root class="w-full p-0">
	<Card.Content class="p-0">
		<MapLibre bind:map class="h-[55vh] rounded-xl" zoom={1} maxZoom={18} {style}>
			<NavigationControl />
			<GlobeControl />
			<Projection type="globe" />
			<FullScreenControl position="top-right" />
			<Tracks />
			<BufferSizeDropdown />
			<WaterSources />
		</MapLibre>
	</Card.Content>
</Card.Root>
