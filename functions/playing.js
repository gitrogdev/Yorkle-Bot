const sessions = new Set();

/**
 * Closes out a session of the game for the given user.
 *
 * @param {import('discord.js').User} user the user to finish the session for
 */
module.exports.finish = function(user) {
	sessions.delete(user.id);
};

/**
 * Checks whether a user has an active session of the game.
 *
 * @param {import('discord.js').User} user the user to check
 *
 * @returns {boolean} whether the user is currently playing the game
 */
module.exports.isPlaying = function(user) {
	return sessions.has(user.id);
};

/**
 * Opens a session of the game for the given user.
 *
 * @param {import('discord.js').User} user the user to open the session for
 */
module.exports.start = function(user) {
	sessions.add(user.id);
};