const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

const { isPlaying, start } = require('../functions/playing.js');
const { hasPlayed } = require('../functions/game-sessions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yorkle')
		.setDescription(
			'Play a game of Yorkle - the ultimate Radiohead guessing game'
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
		await interaction.deferReply();

		if (hasPlayed(interaction.user)) {
			interaction.reply(
				'You have already played today\'s puzzle! Come back tomorrow '
				+ 'to play again!'
			);
			return;
		};

		if (isPlaying(interaction.user)) {
			interaction.reply(
				'You already have an active session of Yorkle!'
			);
			return;
		}
		const dmed = start(interaction.user);
		interaction.editReply(
			dmed ? 'Started a session of Yorkle. Please see your Direct '
				+ 'Messages to play.' : 'Unable to start a session of Yorkle '
				+ 'with you. Please adjust your Privacy Settings to allow '
				+ 'Direct Messages in this server.'
		);
	}
};