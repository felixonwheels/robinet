const fs = require('fs');
const path = require('path');

const inputFilePath = './world8.pmtiles'; // Path to the large file
const outputDir = './world.pmtiles'; // Directory to save the smaller files
const chunkSize = 10 * 1024 * 1024; // 10MB in bytes

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

// Function to split the file
function splitFile() {
	fs.stat(inputFilePath, (err, stats) => {
		if (err) {
			console.error('Error getting file stats:', err);
			return;
		}

		console.log('File size:', stats.size);
		console.log('Chunk size:', chunkSize);

		let bytesRead = 0;
		let partNumber = 1;
		let startByte = 0;

		const readStream = fs.createReadStream(inputFilePath, {
			highWaterMark: chunkSize
		});
		let writeStream;

		readStream.on('data', (chunk) => {
			if (!writeStream) {
				const endByte = startByte + chunkSize - 1;
				writeStream = fs.createWriteStream(path.join(outputDir, `${startByte}-${endByte}.bin`));
			}

			writeStream.write(chunk);
			bytesRead += chunk.length;
			startByte += chunk.length;

			// Close the current file and move to the next part if necessary
			if (bytesRead >= chunkSize) {
				writeStream.end();
				partNumber++;
				bytesRead = 0;
				writeStream = null; // Reset for the next chunk
			}
		});

		readStream.on('end', () => {
			if (writeStream) {
				writeStream.end(); // Ensure the last chunk is written
			}
			console.log('File splitting complete.');
		});

		readStream.on('error', (err) => {
			console.error('Error reading file:', err);
		});
	});
}

splitFile();
