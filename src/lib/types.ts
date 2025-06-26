import type { Feature, MultiPolygon, Polygon } from 'geojson';

export type FeatureOrNothing = Feature<Polygon | MultiPolygon> | undefined;

export interface WaterSource {
	type: string;
	id: number;
	lat: number;
	lon: number;
	tags: object;
}
