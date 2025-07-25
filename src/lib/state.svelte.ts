import type { Feature, MultiLineString, MultiPolygon, Polygon } from 'geojson';

import type { GPXBuildData, WaterSource } from '$lib/types';

let fileValue = $state<GPXBuildData>();

export const file = {
	get value() {
		return fileValue;
	},
	set value(value: GPXBuildData | undefined) {
		fileValue = value;
	}
};

let gpxFileNameValue = $state<string>();

export const gpxFileName = {
	get value() {
		return gpxFileNameValue;
	},
	set value(value: string | undefined) {
		gpxFileNameValue = value;
	}
};

let tracksValue = $state<MultiLineString>();

export const tracks = {
	get value() {
		return tracksValue;
	},
	set value(value: MultiLineString | undefined) {
		tracksValue = value;
	}
};

let trackBBoxMinLengthValue = $state<number>();

export const trackBBoxMinLength = {
	get value() {
		return trackBBoxMinLengthValue;
	},
	set value(value: number | undefined) {
		trackBBoxMinLengthValue = value;
	}
};

let bufferSizeValue = $state('0.2');

export const bufferSize = {
	get value() {
		return bufferSizeValue;
	},
	set value(value: string) {
		bufferSizeValue = value;
	},
	reset() {
		bufferSizeValue = '0.2';
	}
};

let tracksBuffersValue = $state<Feature<Polygon | MultiPolygon>>();

export const tracksBuffers = {
	get value() {
		return tracksBuffersValue;
	},
	set value(value: Feature<Polygon | MultiPolygon> | undefined) {
		tracksBuffersValue = value;
	}
};

let overpassPolygonsValue = $state<string[]>();

export const overpassPolygons = {
	get value() {
		return overpassPolygonsValue;
	},
	set value(value: string[] | undefined) {
		overpassPolygonsValue = value;
	}
};

let waterSourcesValue = $state<WaterSource[]>();

export const waterSources = {
	get value() {
		return waterSourcesValue;
	},
	set value(value: WaterSource[] | undefined) {
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
