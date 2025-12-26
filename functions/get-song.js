const { execFile } = require('node:child_process');
const fs = require('node:fs');
const { parseFile } = require('music-metadata');
const { promisify } = require('node:util');
const path = require('node:path');

const execFileAsync = promisify(execFile);

const daysPath = '../data/days';
const queuePath = '../data/game-queue.json';
const songsPath = '../songs';

const guessLengths = require('../config/guesslengths.json');
let queueData = require(queuePath);
const shuffleSongs = require('../scripts/shuffle-songs.js');
const updateJson = require('../util/update-json.js');

/**
 * Gets the file name of today's song, and advances the queue if a day has
 * passed.
 *
 * @returns {Object} a JSON Object containing
 * - day: the incremental date of today's song
 * - song: the file name of today's song
 */
module.exports = async function() {
	const today = new Date().toISOString().split('T')[0];
	if (today === queueData.lastPlayed) return {
		day: queueData.day,
		song: queueData.queue[queueData.index]
	};

	queueData.lastPlayed = today;
	let index = ++queueData.index;
	const day = ++queueData.day;
	const padDay = day.toString().padStart(4, '0');

	if (index >= queueData.queue.length) {
		queueData.index = -1;
		queueData = shuffleSongs();
		index = ++queueData.index;
	}

	const song = queueData.queue[index];
	const songPath = path.join(__dirname, `${songsPath}/${song}`);
	const metadata = await parseFile(songPath);
	const { title, album } = metadata.common;
	const duration = metadata.format.duration;
	const timestamp = Math.floor(
		Math.random() * (duration - guessLengths.at(-1))
	);

	const clipsPath = path.join(daysPath.substring(1), `day${padDay}`);
	fs.mkdirSync(clipsPath);

	for (let i = 0; i < guessLengths.length; i++) {
		const length = guessLengths[i];
		await execFileAsync('C:\\ffmpeg\\bin\\ffmpeg.exe', [
			'-y',
			'-ss', timestamp.toString(),
			'-t', length.toString(),
			'-i', songPath,
			'-c:a', 'libvorbis',
			path.join(clipsPath, `clip${i}.ogg`)
		]);
	};

	const dateData = {
		day: day,
		song: song,
		title: title,
		album: album,
		timestamp: timestamp,
		players: {}
	};
	updateJson(`${daysPath}/yorkle-day${padDay}.json`, dateData);

	updateJson(queuePath, queueData);
	return {
		day: day,
		song: song
	};
};