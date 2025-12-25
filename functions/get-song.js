const queuePath = '../data/game-queue.json';

let queueData = require(queuePath);
const shuffleSongs = require('../scripts/shuffle-songs.js');
const updateJson = require('../util/update-json.js');

/**
 * Gets the file name of today's song, and advances the queue if a day has
 * passed.
 * @returns the file name of today's song
 */
module.exports = function() {
	const today = new Date().toISOString().split('T')[0];
	if (today === queueData.lastPlayed) return queueData.queue[queueData.index];

	queueData.lastPlayed = today;
	let index = ++queueData.index;

	if (index >= queueData.queue.length) {
		queueData.index = -1;
		queueData = shuffleSongs();
		index = ++queueData.index;
	}

	updateJson(queuePath, queueData);
	return queueData.queue[index];
};