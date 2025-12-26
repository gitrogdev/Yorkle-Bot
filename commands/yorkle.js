const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

const { isPlaying, start } = require('../functions/playing.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yorkle')
		.setDescription(
			'Play a game of Yorkle - the ultimate Radiohead guessing game.'
		)
		.setContexts(
			InteractionContextType.Guild,
			InteractionContextType.BotDM
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
		const dmed = start(interaction.user);
		interaction.reply(
			dmed ? 'Started a session of Yorkle. Please see your Direct '
				+ 'Messages to play.' : 'Unable to start a session of Yorkle '
				+ 'with you. Please adjust your Privacy Settings to allow '
				+ 'Direct Messages in this server.'
		);
	}
};