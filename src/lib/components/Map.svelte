<script lang="ts">
	import { PMTilesProtocol } from '@svelte-maplibre-gl/pmtiles';
	import type { Position } from 'geojson';
	import { LngLat, LngLatBounds, Map } from 'maplibre-gl';
	import { mode } from 'mode-watcher';
	import { MapLibre, NavigationControl, Projection } from 'svelte-maplibre-gl';

	import BufferSizeDropdown from '$lib/components/BufferSizeDropdown.svelte';
	import Tracks from '$lib/components/Tracks.svelte';
	import WaterSources from '$lib/components/WaterSources.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { bufferSize, file, overpassPolygons } from '$lib/state.svelte';
	import { styleDark, styleLight } from '$lib/style';
	import { computeMapBounds } from '$lib/utils';

	let map: Map | undefined = $state();
	let style = $derived(mode.current === 'dark' ? styleDark : styleLight);

	$effect(() => {
		if (file.value !== null) {
			let bounds = computeMapBounds(
				(file.value?.trk ?? []).flatMap(
					(track) =>
						track.trkseg?.flatMap((seg) =>
							seg.trkpt.map((pt) => [pt.attributes.lon, pt.attributes.lat] as Position)
						) ?? []
				)
			);

			if (bounds != null) {
				let sw = new LngLat(bounds.attributes.minlon ?? 0, bounds.attributes.minlat ?? 0);
				let ne = new LngLat(bounds.attributes.maxlon ?? 0, bounds.attributes.maxlat ?? 0);
				let llb = new LngLatBounds(sw, ne);

				map?.fitBounds(llb, {
					padding: 80,
					animate: true
				});
			}
		}
	});
</script>

<PMTilesProtocol />

<Card.Root class="w-full p-0">
	<Card.Content class="p-0">
		<MapLibre bind:map class="h-[55vh] rounded-xl" zoom={1} maxZoom={18} {style}>
			<NavigationControl />
			<Projection type="globe" />
			<Tracks />
			<BufferSizeDropdown />
			{#if overpassPolygons.value.length}
				{#key bufferSize.value && overpassPolygons.value}
					<WaterSources />
				{/key}
			{/if}
		</MapLibre>
	</Card.Content>
</Card.Root>
