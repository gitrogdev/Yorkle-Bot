const fs = require('node:fs');
const path = require('node:path');

const shuffleArray = require('../util/shuffle-array.js');

const dataPath = path.join(__dirname, '../data/game-queue.json');
const songsPath = path.join(__dirname, '../songs');

/**
 * Shuffles all songs in the queue after the current index, and populates it
 * with any new songs if any exist.
 *
 * If the game-queue.json file does not exist, initializes it with default
 * values.
 * @returns the JavaScript Object containing the shuffled queue data
 */
function shuffle() {
	let queueData;

	if (fs.existsSync(dataPath)) queueData = JSON.parse(
		fs.readFileSync(dataPath, 'utf-8')
	); else {
		queueData = {
			index: -1,
			lastPlayed: new Date(
				new Date().setDate(new Date().getDate() - 1)
			).toISOString().split('T')[0],
			queue: []
		};
		fs.writeFileSync(dataPath, JSON.stringify(queueData));
	}

	const unplayed = [];
	const originalLength = queueData.queue.length;

	while (queueData.queue.length > queueData.index + 1) unplayed.push(
		queueData.queue.pop()
	);

	const songFiles = fs.readdirSync(songsPath).filter(
		(file) => file.endsWith('.mp3')
	);
	for (const song of songFiles) if (
		!unplayed.includes(song) && !queueData.queue.includes(song)
	) unplayed.push(song);

	shuffleArray(unplayed);

	while (unplayed.length > 0) queueData.queue.push(unplayed.pop());
	fs.writeFileSync(dataPath, JSON.stringify(queueData));

	const additions = queueData.queue.length - originalLength;
	const shuffled = queueData.queue.length - (queueData.index + 1);
	console.log(
		`Successfully added ${additions} song${additions == 1 ? '' : 's'} to `
		+ `the queue and shuffled ${shuffled} song${shuffled == 1 ? '' : 's'}.`
	);

	return queueData;
};

module.exports = shuffle;
if (require.main === module) shuffle();