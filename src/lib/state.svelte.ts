import { buffer } from '@turf/turf';
import type { Feature, GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';
import * as gpx from 'gpx.studio/gpx/src/index';

let fileValue = $state<gpx.GPXFile[] | null>(null);

export const file = {
	get value() {
		return fileValue;
	},
	setValue(value: gpx.GPXFile[] | null) {
		fileValue = value;
	}
};

const tracksValue = $derived<GeoJSON.GeoJSON[]>(
	(file.value?.[0].trk ?? []).map((track) => ({
		type: 'LineString',
		coordinates: track.getTrackPoints().map((point) => [point.attributes.lon, point.attributes.lat])
	}))
);

export const tracks = {
	get value() {
		return tracksValue;
	}
};

let bufferSizeValue = $state(10);

export const bufferSize = {
	get value() {
		return bufferSizeValue;
	},
	setValue(value: number) {
		bufferSizeValue = value;
	}
};

type FeatureOrNothing = Feature<Polygon | MultiPolygon> | undefined;

const tracksBuffersValue = $derived.by<FeatureOrNothing[]>(() => {
	return tracks.value.map((track) =>
		buffer(track as Feature<Geometry, GeoJsonProperties>, bufferSizeValue, {
			units: 'kilometers'
		})
	);
});

export const tracksBuffers = {
	get value() {
		return tracksBuffersValue;
	}
};
