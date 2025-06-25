type FeatureOrNothing = Feature<Polygon | MultiPolygon> | undefined;

interface WaterSource {
	type: string;
	id: number;
	lat: number;
	lon: number;
	tags: { amenity: string };
}
