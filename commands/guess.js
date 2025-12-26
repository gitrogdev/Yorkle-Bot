const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

const { isPlaying, makeGuess } = require('../functions/playing.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guess')
		.setDescription('Guess the song from the clip provided')
		.addStringOption((option) => option.setName('song')
			.setDescription('The song title to guess.')
			.setRequired(true)
		)
		.setContexts(
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
		if (!playing) {
			interaction.reply(
				'You must have an active session of Yorkle to use this command!'
			);
			return;
		}

		const guess = interaction.options.getString('song');
		interaction.reply(await makeGuess(interaction.user, guess));
	}
};