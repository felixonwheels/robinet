import * as gpx from 'gpx.studio/gpx/src/index';

let file = $state<gpx.GPXFile[] | null>(null);

export const route = {
	file() {
		return file;
	},
	setFile(value: gpx.GPXFile[] | null) {
		file = value;
	}
};
