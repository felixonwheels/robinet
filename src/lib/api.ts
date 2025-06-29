import type { WaterSource } from './types';

export const api = () => ({
	getWaterSources: async (poly: string[], signal: AbortSignal) => {
		const query = `
			[out:json][timeout:60];

			(
			node["amenity"="drinking_water"](poly:"${poly}");
			way["amenity"="drinking_water"](poly:"${poly}");
			relation["amenity"="drinking_water"](poly:"${poly}");

			node["amenity"="toilets"]["drinking_water"~"^(yes|designated)$"](poly:"${poly}");
			way["amenity"="toilets"]["drinking_water"~"^(yes|designated)$"](poly:"${poly}");
			relation["amenity"="toilets"]["drinking_water"~"^(yes|designated)$"](poly:"${poly}");

			node["man_made"="water_tap"]["drinking_water"~"^(yes|designated)$"](poly:"${poly}");
			way["man_made"="water_tap"]["drinking_water"~"^(yes|designated)$"](poly:"${poly}");

			node["natural"="spring"]["drinking_water"~"^(yes|designated)$"](poly:"${poly}");
			node["amenity"="fountain"]["drinking_water"~"^(yes|designated)$"](poly:"${poly}");

			node["man_made"="standpipe"]["drinking_water"~"^(yes|designated)$"](poly:"${poly}");
			);
			
			out center;
		`;

		const url = 'https://overpass-api.de/api/interpreter';

		return fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({ data: query }).toString(),
			signal
		})
			.then((resp) => {
				return resp.json();
			})
			.then((json) => {
				return json.elements as WaterSource[];
			});
	}
});
