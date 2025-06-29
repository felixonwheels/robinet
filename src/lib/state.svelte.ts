import { buffer } from '@turf/turf';
import type { Feature, GeoJsonProperties, Geometry, LineString, Polygon, Position } from 'geojson';

import type { FeatureOrNothing, GPXBuildData, WaterSource } from './types';

let fileValue = $state<GPXBuildData | null>(null);

export const file = {
	get value() {
		return fileValue;
	},
	setValue(value: GPXBuildData | null) {
		fileValue = value;
	}
};

let gpxFileNameValue: string | null = $state(null);

export const gpxFileName = {
	get value() {
		return gpxFileNameValue;
	},
	setValue(value: string | null) {
		gpxFileNameValue = value;
	}
};

const tracksValue = $derived<GeoJSON.GeoJSON[]>(
	(file.value?.trk ?? []).map(
		(track) =>
			({
				type: 'LineString',
				coordinates:
					track.trkseg?.flatMap((seg) =>
						seg.trkpt.map((pt) => [pt.attributes.lon, pt.attributes.lat] as Position)
					) ?? []
			}) as LineString
	)
);

export const tracks = {
	get value() {
		return tracksValue;
	}
};

let bufferSizeValue = $state(1);

export const bufferSize = {
	get value() {
		return bufferSizeValue;
	},
	setValue(value: number) {
		bufferSizeValue = value;
	}
};

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

export function geojsonPolygonToOverpassPoly(feature: Feature<Polygon>): string {
	return feature.geometry.coordinates[0].map(([lon, lat]) => `${lat} ${lon}`).join(' ');
}

const overpassPolygonsValue = $derived<string[]>(
	tracksBuffers.value.map((track) => geojsonPolygonToOverpassPoly(track as Feature<Polygon>))
);

export const overpassPolygons = {
	get value() {
		return overpassPolygonsValue;
	}
};

let waterSourcesValue = $state<WaterSource[] | null>(null);

export const waterSources = {
	get value() {
		return waterSourcesValue;
	},
	setValue(value: WaterSource[] | null) {
		waterSourcesValue = value;
	}
};

let selectedWaterSourcesValue = $state<Set<number> | null>(null);

export const selectedWaterSources = {
	get value() {
		return selectedWaterSourcesValue;
	},
	setSelectedWaterSources(waterSources: WaterSource[] | null) {
		if (waterSources === null) {
			selectedWaterSourcesValue = null;
		} else {
			selectedWaterSourcesValue = new Set(waterSources.map((waterSource) => waterSource.id) ?? []);
		}
	},
	toggleWaterSource(id: number) {
		if (selectedWaterSourcesValue?.has(id)) {
			selectedWaterSourcesValue = new Set([...selectedWaterSourcesValue].filter((x) => x !== id));
		} else {
			selectedWaterSourcesValue = new Set([...(selectedWaterSourcesValue ?? new Set()), id]);
		}
	}
};
