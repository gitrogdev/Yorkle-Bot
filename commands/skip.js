const { SlashCommandBuilder } = require('discord.js');

const { isPlaying } = require('../functions/playing.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current clip to guess on a longer one.'),
	/**
	 * Executes the command.
	 *
	 * @param {import('discord.js').Interaction} interaction the command
	 * interaction
	 */
	async execute(interaction) {
		const playing = isPlaying(interaction.user);
		if (!playing) {
			interaction.reply(
				'You must have an active session of Yorkle to use this command!'
			);
			return;
		}
		interaction.reply('Skipping the current clip.');
	}
};