<script lang="ts">
	import { type AllGeoJSON, bbox, buffer } from '@turf/turf';
	import type { Feature, GeoJSON, MultiLineString, MultiPolygon, Polygon } from 'geojson';
	import { FillLayer, GeoJSONSource, LineLayer } from 'svelte-maplibre-gl';

	import {
		bufferSize,
		file,
		overpassPolygons,
		trackBBoxMinLength,
		tracks,
		tracksBuffers
	} from '$lib/state.svelte';
	import { geojsonPolygonToOverpassPoly } from '$lib/utils';

	$effect(() => {
		if (file.value !== undefined) {
			tracks.value = {
				type: 'MultiLineString',
				coordinates: file.value.trk?.flatMap(
					(track) =>
						track.trkseg?.map((seg) =>
							seg.trkpt.map((pt) => [pt.attributes.lon, pt.attributes.lat])
						) ?? []
				)
			} as MultiLineString;
		}
	});

	$effect(() => {
		if (file.value !== undefined) {
			const box = bbox(tracks.value as AllGeoJSON);

			trackBBoxMinLength.value = Math.min(box[2] - box[0], box[3] - box[1]);

			tracksBuffers.value = buffer(tracks.value as MultiLineString, +bufferSize.value, {
				units: 'kilometers'
			}) as Feature<Polygon | MultiPolygon>;
		}
	});

	$effect(() => {
		if (file.value !== undefined && tracksBuffers.value !== undefined) {
			if (tracksBuffers.value?.geometry.type === 'Polygon') {
				overpassPolygons.value = [
					geojsonPolygonToOverpassPoly(
						(tracksBuffers.value as Feature<Polygon>).geometry.coordinates[0]
					)
				];
			} else if (tracksBuffers.value?.geometry.type === 'MultiPolygon') {
				overpassPolygons.value = (
					tracksBuffers.value as Feature<MultiPolygon>
				).geometry.coordinates.map((pos) => geojsonPolygonToOverpassPoly(pos[0]));
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
