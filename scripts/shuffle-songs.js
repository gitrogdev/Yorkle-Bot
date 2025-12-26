const fs = require('node:fs');
const path = require('node:path');

const {
	getIndex,
	getQueue,
	updateQueueFile
} = require('../functions/queue-model.js');

const shuffleArray = require('../util/shuffle-array.js');
const { hexify } = require('../util/hexstring.js');

const songsPath = path.join(__dirname, '../songs');

/**
 * Shuffles all songs in the queue after the current index, and populates it
 * with any new songs if any exist.
 *
 * If the game-queue.json file does not exist, initializes it with default
 * values.
 *
 * @returns the JavaScript Object containing the shuffled queue data
 */
function shuffle() {
	const index = getIndex();
	const unplayed = [];
	const queue = getQueue();
	const originalLength = queue.length;

	while (queue.length > index + 1) unplayed.push(
		queue.pop()
	);

	const songFiles = fs.readdirSync(songsPath).filter(
		(file) => file.endsWith('.mp3')
	);
	for (let song of songFiles) {
		song = hexify(song);
		if (!unplayed.includes(song) && !queue.includes(song)) unplayed.push(
			song
		);
	}

	shuffleArray(unplayed);

	while (unplayed.length > 0) queue.push(unplayed.pop());
	updateQueueFile();

	const additions = queue.length - originalLength;
	const shuffled = queue.length - (index + 1);
	console.log(
		`Successfully added ${additions} song${additions == 1 ? '' : 's'} to `
		+ `the queue and shuffled ${shuffled} song${shuffled == 1 ? '' : 's'}.`
	);
};

module.exports = shuffle;
if (require.main === module) shuffle();