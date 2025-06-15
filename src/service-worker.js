//install the service worker
self.addEventListener('install', (event) => {
	console.log('Service Worker installing.');
	event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

//activate the service worker
self.addEventListener('activate', (event) => {
	console.log('Service Worker activating.');
	event.waitUntil(self.clients.claim()); // Become available to all pages
});

//intercept fetch requests for pmtiles files to respond from local static file
self.addEventListener('fetch', (event) => {
	const request = event.request;
	console.log('Service Worker handling network request for: ', request.url);
	console.log(new URL(request.url).pathname);

	//this is a hacky way to verify that the service worker is intercepting fetch requests, called in React before rendering the map
	if (new URL(request.url).pathname === '/checkSw') {
		console.log('returning A-OK');
		return event.respondWith(
			new Response('A-OK', {
				status: 202, // Use 200 to indicate successful response
				headers: {
					'Content-Type': 'text/plain', // Set appropriate content type
					'X-Sw-Tag': 'Served by Service Worker'
				}
			})
		);
	}

	//if the URL is anything other than the .pmtiles file, respond normally
	if (new URL(request.url).pathname == '/world.pmtiles') {
		return event.respondWith(handleRangeRequest(request));
	}
	return event.respondWith(fetch(request));
});

const chunkSize = 10 * 1024 * 1024; // 10MB in bytes

function getFilePathsFromRange(path, range) {
	const start = parseInt(range[1], 10);
	const end = range[2] ? parseInt(range[2], 10) : pmtilesFile.byteLength - 1;

	const firstFileIndex = Math.floor(start / chunkSize);
	const lastFileIndex = Math.floor(end / chunkSize);

	let chunkFilePaths = [];
	//from the first file to the last file, inclusive
	//return an array of file paths (file paths are first byte - last byte, where the index represents the multiple of the chunk size)
	for (let i = firstFileIndex; i <= lastFileIndex; i++) {
		const startByte = i * chunkSize;
		const endByte = startByte + chunkSize - 1;
		const filePath = `${path}/${startByte}-${endByte}.bin`;
		chunkFilePaths.push(filePath);
	}

	return chunkFilePaths;
}

var _appendBuffer = function (buffer1, buffer2) {
	var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
	tmp.set(new Uint8Array(buffer1), 0);
	tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
	return tmp.buffer;
};

async function handleRangeRequest(request) {
	//this is the folder name. by convention, the pmtiles file will be the name of the folder
	const path = new URL(request.url).pathname;
	const fileByteLength = 10485759; //hardcoded for now. this should be the last byte range of your last chunk

	const rangeHeader = request.headers.get('Range');
	const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d+)?/);
	const start = parseInt(rangeMatch[1], 10);
	const end = parseInt(rangeMatch[2], 10);

	const chunkFilePaths = getFilePathsFromRange(path, rangeMatch);

	const pmtilesChunkFiles = [];
	for (let i = 0; i < chunkFilePaths.length; i++) {
		const chunkFile = await fetchPmtilesFile(chunkFilePaths[i]);
		pmtilesChunkFiles.push(chunkFile);
	}

	let chunkStart = start % chunkSize;
	let chunkEnd = end % chunkSize;

	let chunk = new Uint8Array(0);
	for (let i = 0; i < pmtilesChunkFiles.length; i++) {
		//add to the chunk either the entire file or the part of the file that is requested
		//if it is the first file, only add the part of the file that is requested
		//if it is the last file, only add the part of the file that is requested
		//if it is a file in between, add the entire file
		if (i === 0) {
			chunkEnd = chunkEnd > chunkSize ? chunkSize - 1 : chunkEnd;

			const tempChunk = pmtilesChunkFiles[i].slice(chunkStart, chunkEnd + 1);
			chunk = _appendBuffer(chunk, pmtilesChunkFiles[i].slice(chunkStart, chunkEnd + 1));
		} else if (i === pmtilesChunkFiles.length - 1) {
			chunkStart = 0;
			chunk = _appendBuffer(chunk, pmtilesChunkFiles[i].slice(chunkStart, chunkEnd + 1));
		} else {
			chunk = _appendBuffer(chunk, pmtilesChunkFiles[i]);
		}
	}

	const byteSize = chunk.length;

	if (rangeHeader) {
		const start = parseInt(rangeMatch[1], 10);
		const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : fileByteLength - 1;

		return new Response(chunk, {
			status: 206,
			statusText: 'Partial Content',
			headers: {
				'Content-Type': 'application/octet-stream',
				'Content-Length': byteSize,
				'Content-Range': `bytes ${start}-${end}/${fileByteLength}`,
				'X-Sw-Tag': 'Served by Service Worker'
			}
		});
	}

	// If no Range header, return the entire file
	return new Response(pmtilesFile, {
		status: 200,
		statusText: 'OK',
		headers: {
			'Content-Type': 'application/octet-stream',
			'Content-Length': pmtilesFile.byteLength
		}
	});
}

//function to fetch the static pmtiles file and serve it from the cache
async function fetchPmtilesFile(path) {
	const cache = await caches.open('pmtiles-file-cache');
	const cachedResponse = await cache.match(path);

	if (cachedResponse) {
		return cachedResponse.arrayBuffer();
	}

	console.log('Fetching from network');
	const response = await fetch(path);
	const responseClone = response.clone();
	const responseBuffer = await response.arrayBuffer();

	try {
		await cache.put(path, responseClone);
	} catch (e) {
		console.log('Problem writing to cache: ', e);
	}

	return responseBuffer;
}
