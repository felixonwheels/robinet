<script lang="ts">
	import { buffer } from '@turf/turf';
	import type { Feature, MultiPolygon, Polygon } from 'geojson';
	import type { GeoJSON, MultiLineString } from 'geojson';
	import { FillLayer, GeoJSONSource, LineLayer } from 'svelte-maplibre-gl';

	import { bufferSize, file, overpassPolygons, tracks, tracksBuffers } from '$lib/state.svelte';
	import { geojsonPolygonToOverpassPoly } from '$lib/utils';

	$effect(() => {
		if (file.value !== undefined) {
			tracks.setValue({
				type: 'MultiLineString',
				coordinates: file.value.trk?.flatMap(
					(track) =>
						track.trkseg?.map((seg) =>
							seg.trkpt.map((pt) => [pt.attributes.lon, pt.attributes.lat])
						) ?? []
				)
			} as MultiLineString);
		}
	});

	$effect(() => {
		if (file.value !== undefined) {
			tracksBuffers.setValue(
				buffer(tracks.value as MultiLineString, bufferSize.value, {
					units: 'kilometers'
				}) as Feature<Polygon | MultiPolygon>
			);
		}
	});

	$effect(() => {
		if (file.value !== undefined && tracksBuffers.value !== undefined) {
			if (tracksBuffers.value?.geometry.type === 'Polygon') {
				overpassPolygons.setValue([
					geojsonPolygonToOverpassPoly(
						(tracksBuffers.value as Feature<Polygon>).geometry.coordinates[0]
					)
				]);
			} else if (tracksBuffers.value?.geometry.type === 'MultiPolygon') {
				overpassPolygons.setValue(
					(tracksBuffers.value as Feature<MultiPolygon>).geometry.coordinates.map((pos) =>
						geojsonPolygonToOverpassPoly(pos[0])
					)
				);
			}
		}
	});
</script>

{#if tracks.value !== undefined}
	<GeoJSONSource data={tracks.value as GeoJSON}>
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
{/if}

{#if tracksBuffers.value !== undefined}
	<GeoJSONSource data={tracksBuffers.value as GeoJSON}>
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
