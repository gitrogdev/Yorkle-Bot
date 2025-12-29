const fs = require('node:fs');
const path = require('node:path');

const MAX_GUESSES = require('../config/guesslengths.json').length;

const BEST_EMOJI = '👑';
const STREAK_EMOJI = '🔥';
let recapping = false;

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

/**
 * Updates streaks in all guilds, and sends a recap message to each.
 *
 * @param {Object} playerData an object with Discord User IDs as keys and
 * yesterday's results as the values
 */
module.exports.recap = async function(playerData) {
	if (recapping) return;
	recapping = true;

	const client = require('../index.js');
	for (const id in guildsData) {
		const guildData = guildsData[id];
		let played = 0;
		let i = 0;

		const guildSequences = {};
		for (let j = 1; j <= MAX_GUESSES; j++) guildSequences[j] = [];
		guildSequences['X'] = [];

		let guild;
		try {
			guild = await client.guilds.fetch(id);
		} catch (error) {
			console.warn(`Unable to fetch guild with ID ${id}: ${error}`);
			continue;
		}
		while (i < guildData.members.length) {
			const memberId = guildData.members[i];
			try {
				await guild.members.fetch(memberId);
			} catch (error) {
				console.log(
					`Unable to fetch member with ID ${memberId} in guild `
					+ `${id}: ${error}`
				);
				guildData.members.splice(i, 1);
				continue;
			}

			if (memberId in playerData) {
				played++;
				const sequence = playerData[memberId].sequence;
				let guesses = sequence.length;
				if (
					guesses === MAX_GUESSES
					&& sequence.charAt(MAX_GUESSES - 1) !== 'O'
				) guesses = 'X';
				guildSequences[guesses].push(memberId);
			}
			i++;
		}

		if (played === 0) guildData.streak = 0;
		else {
			guildData.streak++;

			let formattedResults = `\n${BEST_EMOJI} `;
			let firstLine = true;
			for (const count in guildSequences) {
				const members = guildSequences[count];
				if (members.length === 0) continue;
				if (!firstLine) formattedResults += '\n';
				else if (firstLine && count === 'X') formattedResults = '\n';
				else firstLine = false;
				formattedResults += `${count}/${MAX_GUESSES}:`;
				for (const memberId of members)
					formattedResults += ` <@${memberId}>`;
			}

			try {
				const channel = await client.channels.fetch(guildData.channel);
				await channel.send(
					`**Your group is on a ${guildData.streak} day streak!** `
					+ STREAK_EMOJI.repeat(Math.ceil(guildData.streak / 30))
					+ ` Here are yesterdays results:${formattedResults}`
				);
			} catch (error) {
				console.log(
					'Unable to send recap message to channel '
					+ `${guildData.channel} in guild ${id}: ${error}`
				);
			}
		}
		updateGuild(id);
	}
	recapping = false;
};