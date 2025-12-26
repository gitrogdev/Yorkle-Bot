const { AttachmentBuilder } = require('discord.js');
const path = require('node:path');

const aliases = require('../config/aliases.json');
const getSong = require('./get-song.js');
const guessLengths = require('../config/guesslengths.json');
const { finishGame } = require('./game-sessions.js');

const NO_SPOILIES = '\n\n-# Yorkle is a daily guessing game in which everyone '
	+ 'guesses the same song each day. Please avoid spoilers when discussing '
	+ 'today\'s answer with other players, who may not have finished today\'s '
	+ 'puzzle yet.';
const dataPath = path.join(__dirname, '../data/days');

const sessions = {};
const validAliases = new Set();
for (const songAliases of Object.values(aliases))
	for (const alias of songAliases) if (
		validAliases.has.alias
	) console.warn(
		`The alias ${alias} appears multiple times in aliases.json`
	); else validAliases.add(alias);

/**
 * Sends a user the audio clip for them to guess.
 *
 * @param {import('discord.js').User} user the user to send the attachment to
 */
function presentClip(user) {
	if (!(user.id in sessions)) return;
	const sessionInfo = sessions[user.id];

	console.log(`Presenting clip${sessionInfo.clip}.mp3 to ${user.username}`);
	user.send({
		content: `**Clip ${sessionInfo.clip}**:\n*Use \`/guess\` to guess the `
			+ 'song or type `/skip` to try a longer clip before guessing.*',
		files: [
			new AttachmentBuilder(path.join(
				dataPath,
				`day${sessionInfo.day}/clip${sessionInfo.clip}.mp3`
			))
		]
	});
}

/**
 * Closes out a session of the game for the given user.
 *
 * @param {import('discord.js').User} user the user to finish the session for
 */
function finish(user) {
	console.log(`${user.username} has finished a round of Yorkle.`);
	finishGame(user, sessions[user.id]);
	delete sessions[user.id];
};

/**
 * Checks whether a user has an active session of the game.
 *
 * @param {import('discord.js').User} user the user to check
 *
 * @returns {boolean} whether the user is currently playing the game
 */
module.exports.isPlaying = function(user) {
	return user.id in sessions;
};

/**
 * Processes a user's guess, and returns a response.
 *
 * Cleans the guess for capitalization and punctuation, then checks if it's a
 * real song. If it is, it checks if it's correct or not. If it's not, it lets
 * the user guess again without expending a guess.
 *
 * @param {import('discord.js').User} user the user making the guess
 * @param {String} guess the song the user is guessing based on the clip
 *
 * @returns a string response to the user based on the result of their guess
 */
module.exports.makeGuess = function(user, guess) {
	if (!(user.id in sessions)) return 'Unable to load session data.';
	const sessionInfo = sessions[user.id];

	const cleanGuess = guess.toLowerCase().replace(/[\s.,\-()/?!]/g, '');
	console.log(
		`${user.username} has guessed "${guess}" (cleaned to "${cleanGuess}")`
	);
	if (!validAliases.has(cleanGuess)) return `Unknown song "${guess}"\nTry `
		+ 'checking for spelling mistakes, or try another song. Answers are '
		+ 'not case or punctuation dependent.';

	const correctAnswer = sessionInfo.answer;
	if (!aliases[correctAnswer].includes(cleanGuess)) {
		sessionInfo.guesses.push('X');
		const continuing = sessionInfo.clip < guessLengths.length;
		if (continuing) {
			sessionInfo.clip++;
			presentClip(user);
		} else finish(user);
		return `❌ **INCORRECT** ❌\n"${guess}" was incorrect. ` + (
			continuing ? 'Try again.' :
				`You're out of guesses. Better luck next time!${NO_SPOILIES}`
		);
	}

	sessionInfo.guesses.push('O');
	const guesses = sessionInfo.clip;
	finish(user);

	return `✅ **CORRECT** ✅\n\nYou guessed the Yorkle in ${guesses} guess`
		+ `${guesses == 1 ? '' : 'es'}! Play again tomorrow, or share your `
		+ `results with your friends with the /share command!${NO_SPOILIES}`;
};

/**
 * Skip the song.
 *
 * @param {import('discord.js').User} user the user skipping the song
 *
 * @returns a string response to the user based on the result of their skip
 */
module.exports.skip = async function(user) {
	if (!(user.id in sessions)) return 'Unable to load session data.';
	const sessionInfo = sessions[user.id];

	if (sessionInfo.clip >= guessLengths.length)
		return 'This is my final clip! Make a guess!';

	console.log(`${user.username} is skipping clip ${sessionInfo.clip}.`);
	sessionInfo.guesses.push('-');
	sessionInfo.clip++;
	presentClip(user);

	return 'Skipping the current clip.';
};

/**
 * Opens a session of the game for the given user.
 *
 * @param {import('discord.js').User} user the user to open the session for
 *
 * @returns {boolean} whether the game session successfully started
 */
module.exports.start = async function(user) {
	const songData = await getSong();
	const day = songData.day;
	try {
		await user.send(`# Yorkle #${day}`);
	} catch {
		return false;
	}

	console.log(`${user.username} has started a round of Yorkle.`);
	sessions[user.id] = {
		answer: songData.song.slice(0, -4),
		clip: 1,
		guesses: [],
		day: day.toString().padStart(4, '0')
	};
	presentClip(user);
	return true;
};