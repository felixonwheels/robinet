<script lang="ts">
	import type { Feature, MultiPolygon, Polygon } from 'geojson';
	import { FillLayer, GeoJSONSource, LineLayer } from 'svelte-maplibre-gl';

	import { tracks, tracksBuffers } from '$lib/state.svelte';
</script>

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
