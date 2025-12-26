const { execFile } = require('node:child_process');
const fs = require('node:fs');
const { parseFile } = require('music-metadata');
const path = require('node:path');
const { promisify } = require('node:util');
const {
	incrementDay,
	incrementIndex,
	updateQueueFile,
	getDay,
	getSong
} = require('./queue-model');

const daysPath = path.join(__dirname, '../data/days');
const execFileAsync = promisify(execFile);
const guessLengths = require('../config/guesslengths.json');
const sequenceEmojis = {
	O: '🟩',
	'-': '🟨',
	X: '🟥'
};
const sequenceFiller = '⬛';
const songsPath = path.join(__dirname, '../songs');

let dateData;
const startDatePath = `${daysPath}/yorkle-day`
	+ `${getDay().toString().padStart(4, '0')}.json`;
if (fs.existsSync(startDatePath)) dateData = JSON.parse(
	fs.readFileSync(startDatePath, 'utf-8')
);

/**
 * Writes the results of a finished game to the day's file.
 *
 * @param {import('discord.js').User} user the user that finished the game
 * @param {Object} sessionInfo the session info for the user's game session
 */
module.exports.finishGame = function(user, sessionInfo) {
	const day = Number.parseInt(sessionInfo.day);

	const dataPath = path.join(
		daysPath,
		`yorkle-day${day.toString().padStart(4, '0')}.json`
	);
	const updateData = day == dateData.day ? dateData : require(dataPath);
	updateData.players[user.id] = {
		sequence: sessionInfo.guesses.join('')
	};

	module.exports.updateDay(day);
};

/**
 * Checks if a user has already finished today's game.
 *
 * @param {import('discord.js').User} user the user to check
 *
 * @returns whether the user has already finished today's game
 */
module.exports.hasPlayed = function(user) {
	return dateData != null && user.id in dateData.players;
};

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

	const song = getSong(index);
	const songPath = path.join(songsPath, song);
	const metadata = await parseFile(songPath);
	// const { title, album } = metadata.common;
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
		// title: title,
		// album: album,
		timestamp: timestamp,
		players: {}
	};

	updateQueueFile();
	module.exports.updateDay(day);
};

/**
 * Formats the sequence as a sharable results message.
 *
 * @param {import('discord.js').User} user the user to get the results for
 *
 * @returns {String} the sharable results message
 */
module.exports.results = function(user) {
	if (!module.exports.hasPlayed(user)) return 'Use `/yorkle` to solve '
		+ 'today\'s puzzle to share your results!';

	const sequence = dateData.players[user.id].sequence;
	let response = `Yorkle #${dateData.day}\n`;
	for (const char of sequence) response += sequenceEmojis[char];
	response += sequenceFiller.repeat(guessLengths.length - sequence.length);
	response += '\n\n-# Yorkle is the ultimate Radiohead guessing game. '
		+ 'Every day, players are presented with random clips from a song, and '
		+ 'they to identify them in as few guesses as possible. Use the '
		+ '`/yorkle` command to start today\'s puzzle.';
	return response;
};

/**
 * Updates the .json file containing data for a day's game.
 *
 * @param {number} day the number of the day to update
 */
module.exports.updateDay = function(day) {
	const dataPath = path.join(
		daysPath,
		`yorkle-day${day.toString().padStart(4, '0')}.json`
	);
	const updateData = day == dateData.day ? dateData : require(dataPath);

	fs.writeFileSync(
		dataPath,
		JSON.stringify(updateData)
	);
};
