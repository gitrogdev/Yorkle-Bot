const { execFile } = require('node:child_process');
const fs = require('node:fs');
const { parseFile } = require('music-metadata');
const path = require('node:path');
const { promisify } = require('node:util');
const {
	incrementDay,
	incrementIndex,
	updateQueueFile,
	getQueue,
	getDay
} = require('./queue-model');

const daysPath = path.join(__dirname, '../data/days');
const execFileAsync = promisify(execFile);
const guessLengths = require('../config/guesslengths.json');
const songsPath = path.join(__dirname, '../songs');

let dateData;
const startDatePath = `${daysPath}/yorkle-day`
	+ `${getDay().toString().padStart(4, '0')}.json`;
if (fs.existsSync(startDatePath)) dateData = JSON.parse(
	fs.readFileSync(startDatePath, 'utf-8')
);

/**
 * Starts the game for a new day.
 *
 * Creates the six clip files for today's song, and creates the game file
 * containing the day's information.
 */
module.exports.newDay = async function() {
	const day = incrementDay();
	const index = incrementIndex();
	const padDay = day.toString().padStart(4, '0');
	const queue = getQueue();

	const song = queue[index];
	const songPath = path.join(songsPath, song);
	const metadata = await parseFile(songPath);
	const { title, album } = metadata.common;
	const duration = metadata.format.duration;
	const timestamp = Math.floor(
		Math.random() * (duration - guessLengths.at(-1))
	);

	const clipsPath = path.join(daysPath, `day${padDay}`);
	fs.mkdirSync(clipsPath);

	for (let i = 0; i < guessLengths.length; i++) {
		const length = guessLengths[i];
		await execFileAsync('C:\\ffmpeg\\bin\\ffmpeg.exe', [
			'-y',
			'-ss', timestamp.toString(),
			'-t', length.toString(),
			'-i', songPath,
			'-map_metadata', '-1',
			'-c:a', 'copy',
			path.join(clipsPath, `clip${i + 1}.mp3`)
		]);
	};

	dateData = {
		day: day,
		song: song,
		title: title,
		album: album,
		timestamp: timestamp,
		players: {}
	};

	updateQueueFile();
	updateDay();
};

/**
 * Updates the .json file containing data for today's game.
 */
function updateDay() {
	fs.writeFileSync(
		path.join(
			daysPath,
			`yorkle-day${getDay().toString().padStart(4, '0')}.json`
		),
		JSON.stringify(dateData)
	);
};
module.exports.updateDay = updateDay;