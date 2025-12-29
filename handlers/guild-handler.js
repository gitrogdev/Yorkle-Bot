const fs = require('node:fs');
const path = require('node:path');

const guildsData = {};
const guildsPath = path.join(__dirname, '../data/guilds');
const guildFiles = fs.readdirSync(guildsPath).filter(
	(file) => file.endsWith('.json')
);
for (const file of guildFiles) {
	if (file.substring(0, 6) !== 'guild-') {
		console.warn(
			`data/guilds/${file} does not follow expected naming conventions!`
		);
		continue;
	}

	const filePath = path.join(guildsPath, file);
	const guildData = require(filePath);

	guildsData[file.substring(6).slice(0, -5)] = guildData;
}
console.log(guildsData);

/**
 * Creates the base object for a new guild
 *
 * @param {String} id the Server ID of the guild to create the object for
 */
function newGuild(id) {
	guildsData[id] = {
		streak: 0,
		members: []
	};
};

/**
 * Updates the JSON file for an individual guild.
 *
 * @param {String} id the Server ID of the guild to update the JSON file for
 */
function updateGuild(id) {
	fs.writeFileSync(
		path.join(guildsPath, `guild-${id}.json`),
		JSON.stringify(guildsData[id])
	);
};

/**
 * Adds a user to the list of guilds
 * @param {import('discord.js').User} user the user playing in the guild
 * @param {String} id the Server ID of the guild the user is playing in
 * @param {String} channel the Channel ID of the channel the user is playing in
 */
module.exports.playInGuild = function(user, id, channel) {
	if (!(id in guildsData)) newGuild(id);
	const guildData = guildsData[id];

	let updated = false;
	if (!(channel in guildData)) {
		updated = true;
		guildData.channel = channel;
	}

	if (!guildData.members.includes(user.id)) {
		guildData.members.push(user.id);
		updated = true;
	}

	if (updated) updateGuild(id);
};