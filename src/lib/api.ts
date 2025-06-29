import type { WaterSource } from './types';

export const api = () => ({
	getWaterSources: async (poly: string[], signal: AbortSignal) => {
		let query = '[out:json][timeout:60];(';

		for (const p of poly) {
			query += `
				node["amenity"="drinking_water"](poly:"${p}");
				way["amenity"="drinking_water"](poly:"${p}");
				relation["amenity"="drinking_water"](poly:"${p}");

				node["amenity"="toilets"]["drinking_water"~"^(yes|designated)$"](poly:"${p}");
				way["amenity"="toilets"]["drinking_water"~"^(yes|designated)$"](poly:"${p}");
				relation["amenity"="toilets"]["drinking_water"~"^(yes|designated)$"](poly:"${p}");

				node["man_made"="water_tap"]["drinking_water"~"^(yes|designated)$"](poly:"${p}");
				way["man_made"="water_tap"]["drinking_water"~"^(yes|designated)$"](poly:"${p}");

				node["natural"="spring"]["drinking_water"~"^(yes|designated)$"](poly:"${p}");
				node["amenity"="fountain"]["drinking_water"~"^(yes|designated)$"](poly:"${p}");

				node["man_made"="standpipe"]["drinking_water"~"^(yes|designated)$"](poly:"${p}");
			`;
		}

		query += '); out center;';

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
