import { type ClassValue, clsx } from 'clsx';
import { XMLParser } from 'fast-xml-parser';
import type { Feature, Polygon, Position } from 'geojson';
import { twMerge } from 'tailwind-merge';

import type { Bounds } from '$lib/types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function computeMapBounds(positions: Position[]): Bounds | null {
	if (positions.length === 0) return null;

	const { minlat, maxlat, minlon, maxlon } = positions.reduce(
		(acc, [lon, lat]) => ({
			minlat: Math.min(acc.minlat, lat),
			maxlat: Math.max(acc.maxlat, lat),
			minlon: Math.min(acc.minlon, lon),
			maxlon: Math.max(acc.maxlon, lon)
		}),
		{
			minlat: positions[0][1],
			maxlat: positions[0][1],
			minlon: positions[0][0],
			maxlon: positions[0][0]
		}
	);

	return {
		attributes: { minlat, maxlat, minlon, maxlon }
	} as Bounds;
}

export function safeParseFloat(value: string): number {
	const parsed = parseFloat(value);
	if (!isNaN(parsed)) {
		return parsed;
	}
	for (const pattern of floatPatterns) {
		const match = value.match(pattern);
		if (match) {
			return parseFloat(match[0]);
		}
	}
	return 0.0;
}

export const attributesWithNamespace: Record<string, string> = {
	RoutePointExtension: 'gpxx:RoutePointExtension',
	rpt: 'gpxx:rpt',
	TrackPointExtension: 'gpxtpx:TrackPointExtension',
	PowerExtension: 'gpxpx:PowerExtension',
	atemp: 'gpxtpx:atemp',
	hr: 'gpxtpx:hr',
	cad: 'gpxtpx:cad',
	Extensions: 'gpxtpx:Extensions',
	PowerInWatts: 'gpxpx:PowerInWatts',
	power: 'gpxpx:PowerExtension',
	line: 'gpx_style:line',
	color: 'gpx_style:color',
	opacity: 'gpx_style:opacity',
	width: 'gpx_style:width'
};

const floatPatterns = [
	/[-+]?\d*\.\d+$/, // decimal
	/[-+]?\d+$/ // integer
];

export const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: '',
	attributesGroupName: 'attributes',
	removeNSPrefix: true,
	isArray(name: string) {
		return (
			name === 'trk' ||
			name === 'trkseg' ||
			name === 'trkpt' ||
			name === 'wpt' ||
			name === 'rte' ||
			name === 'rtept' ||
			name === 'gpxx:rpt'
		);
	},
	attributeValueProcessor(attrName, attrValue, _) {
		if (attrName === 'lat' || attrName === 'lon') {
			return safeParseFloat(attrValue);
		}
		return attrValue;
	},
	transformTagName(tagName: string) {
		if (Object.hasOwn(attributesWithNamespace, tagName)) {
			return attributesWithNamespace[tagName];
		}
		return tagName;
	},
	parseTagValue: false,
	tagValueProcessor(tagName, tagValue, jPath, hasAttributes, isLeafNode) {
		if (isLeafNode) {
			if (tagName === 'ele') {
				return safeParseFloat(tagValue);
			}

			if (tagName === 'time') {
				return new Date(tagValue);
			}

			if (
				tagName === 'gpxtpx:atemp' ||
				tagName === 'gpxtpx:hr' ||
				tagName === 'gpxtpx:cad' ||
				tagName === 'gpxpx:PowerInWatts' ||
				tagName === 'gpx_style:opacity' ||
				tagName === 'gpx_style:width'
			) {
				return safeParseFloat(tagValue);
			}

			if (tagName === 'gpxpx:PowerExtension') {
				return {
					'gpxpx:PowerInWatts': safeParseFloat(tagValue)
				};
			}
		}

		return tagValue;
	}
});

export function geojsonPolygonToOverpassPoly(feature: Feature<Polygon>): string {
	return feature.geometry.coordinates[0].map(([lon, lat]) => `${lat} ${lon}`).join(' ');
}
