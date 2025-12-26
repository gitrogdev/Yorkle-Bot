const queuePath = '../data/game-queue.json';

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
module.exports = function() {
	const today = new Date().toISOString().split('T')[0];
	if (today === queueData.lastPlayed) return {
		day: queueData.day,
		song: queueData.queue[index]
	};

	queueData.lastPlayed = today;
	let index = ++queueData.index;

	if (index >= queueData.queue.length) {
		queueData.index = -1;
		queueData = shuffleSongs();
		index = ++queueData.index;
	}

	updateJson(queuePath, queueData);
	return {
		day: ++queueData.day,
		song: queueData.queue[index]
	};
};