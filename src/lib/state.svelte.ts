import type { Feature, MultiLineString, MultiPolygon, Polygon } from 'geojson';

import type { GPXBuildData, WaterSource } from '$lib/types';

let fileValue = $state<GPXBuildData>();

export const file = {
	get value() {
		return fileValue;
	},
	setValue(value: GPXBuildData | undefined) {
		fileValue = value;
	}
};

let gpxFileNameValue = $state<string>();

export const gpxFileName = {
	get value() {
		return gpxFileNameValue;
	},
	setValue(value: string) {
		gpxFileNameValue = value;
	}
};

let tracksValue = $state<MultiLineString>();

export const tracks = {
	get value() {
		return tracksValue;
	},
	setValue(value: MultiLineString | undefined) {
		tracksValue = value;
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

let tracksBuffersValue = $state<Feature<Polygon | MultiPolygon>>();

export const tracksBuffers = {
	get value() {
		return tracksBuffersValue;
	},
	setValue(value: Feature<Polygon | MultiPolygon> | undefined) {
		tracksBuffersValue = value;
	}
};

let overpassPolygonsValue = $state<string[]>();

export const overpassPolygons = {
	get value() {
		return overpassPolygonsValue;
	},
	setValue(value: string[] | undefined) {
		overpassPolygonsValue = value;
	}
};

let waterSourcesValue = $state<WaterSource[]>();

export const waterSources = {
	get value() {
		return waterSourcesValue;
	},
	setValue(value: WaterSource[] | undefined) {
		waterSourcesValue = value;
	}
};

let selectedWaterSourcesValue = $state<Set<number>>();

export const selectedWaterSources = {
	get value() {
		return selectedWaterSourcesValue;
	},
	setSelectedWaterSources(waterSources: WaterSource[] | undefined) {
		if (waterSources === null) {
			selectedWaterSourcesValue = undefined;
		} else {
			selectedWaterSourcesValue = new Set(waterSources?.map((waterSource) => waterSource.id) ?? []);
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
