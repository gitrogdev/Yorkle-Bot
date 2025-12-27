const fs = require('node:fs');
const { parseFile } = require('music-metadata');
const path = require('node:path');

const albums = require('../config/albums.json');

const mediaPath = path.join(__dirname, '../media');
const songsPath = path.join(__dirname, '../songs');

const songFiles = fs.readdirSync(songsPath).filter(
	(file) => file.endsWith('.mp3')
);

let errors = 0;
let validated = 0;

(async () => {
	try {
		for (const song of songFiles) {
			const songPath = path.join(songsPath, song);
			const metadata = await parseFile(songPath);
			const { title, album } = metadata.common;
			if (!(album in albums)) {
				console.warn(`${album} not found in albums.json for ${title}!`);
				errors++;
				continue;
			}

			const albumFile = albums[album] + '.jpg';
			const coverPath = path.join(mediaPath, albumFile);

			if (!fs.existsSync(coverPath)) {
				console.warn(`Missing ${albumFile} for ${title} in ${album}!`);
				errors++;
				continue;
			}

			validated++;
		};

		console.log(
			`Validated ${validated} album${validated == 1 ? '' : 's'} with `
			+ `${errors} error${errors == 1 ? '' : 's'}.`
		);
	} catch (error) {
		console.error(error);
	}
})();