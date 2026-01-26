const {
	getDay,
	getLastPlayed,
	updateLastPlayed
} = require('../old/handlers/queue-handler.js');
const { newDay, getMetadata } = require('../old/handlers/game-handler.js');

/**
 * Gets the information for today's song, and advances the queue if a day has
 * passed.
 *
 * @returns {Object} a JSON Object containing
 * - day: the incremental date of today's song
 * - song: the file name of today's song
 */
module.exports = async function() {
	const today = new Date().toISOString().split('T')[0];
	if (today !== getLastPlayed()) {
		updateLastPlayed();
		newDay();
	};

	const metadata = await getMetadata();
	return {
		day: getDay(),
		song: metadata.filename,
		artist: metadata.artist,
		title: metadata.title,
		album: metadata.album
	};
};