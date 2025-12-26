const { SlashCommandBuilder } = require('discord.js');

const { isPlaying, start } = require('../functions/playing.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yorkle')
		.setDescription(
			'Play a game of Yorkle - the ultimate Radiohead guessing game.'
		),
	/**
	 * Executes the command.
	 *
	 * @param {import('discord.js').Interaction} interaction the command
	 * interaction
	 */
	async execute(interaction) {
		const playing = isPlaying(interaction.user);
		if (playing) {
			interaction.reply(
				'You already have an active session of Yorkle!'
			);
			return;
		}
		start(interaction.user);
		interaction.reply('Starting a session of Yorkle.');
	}
};