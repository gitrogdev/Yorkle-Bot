const fs = require('node:fs');
const path = require('node:path');

const dataPath = path.join(__dirname, '../data/game-queue.json');
const shuffleSongs = require('../scripts/shuffle-songs.js');
const { dehexify } = require('../util/hexstring.js');

let queueData;
if (fs.existsSync(dataPath)) queueData = JSON.parse(
	fs.readFileSync(dataPath, 'utf-8')
); else {
	queueData = {
		index: -1,
		day: 0,
		lastPlayed: new Date(
			new Date().setDate(new Date().getDate() - 1)
		).toISOString().split('T')[0],
		queue: []
	};
	fs.writeFileSync(dataPath, JSON.stringify(queueData));
};

/**
 * Gets the day number of the current game.
 *
 * @returns {number} the day number of the current game
 */
module.exports.getDay = function() {
	return queueData.day;
};

/**
 * Gets the index of the current song in the game's queue.
 *
 * @returns {number} the current index in the game's queue
 */
module.exports.getIndex = function() {
	return queueData.index;
};

/**
 * Gets the date that the game was last played on.
 *
 * @returns {String} the date the game was last played on in YYYY-MM-DD format
 */
module.exports.getLastPlayed = function() {
	return queueData.lastPlayed;
};

/**
 * Gets the array containing the queue of upcoming songs.
 *
 * @returns {Array} the queue of upcoming songs
 */
module.exports.getQueue = function() {
	return queueData.queue;
};

/**
 * Gets the song at the given index of the queue.
 *
 * @param {number} index the index of the queue to get the song at
 *
 * @returns {String} the filename of the song at the position in the queue
 */
module.exports.getSong = function(index) {
	return dehexify(queueData.queue[index]);
};

/**
 * Increments the day number of the game, and returns the new value.
 *
 * @returns the incremented day number of the current game
 */
module.exports.incrementDay = function() {
	return ++queueData.day;
};

module.exports.incrementIndex = function() {
	let index = ++queueData.index;
	if (index >= queueData.queue.length) {
		queueData.index = -1;
		queueData = shuffleSongs();
		index = ++queueData.index;
	}

	return index;
};

/**
 * Updates the date that the game was last played on.
 */
module.exports.updateLastPlayed = function() {
	queueData.lastPlayed = new Date().toISOString().split('T')[0];
};

/**
 * Updates the .json file containing the queue data with the updated queue.
 */
module.exports.updateQueueFile = function() {
	fs.writeFileSync(dataPath, JSON.stringify(queueData));
};