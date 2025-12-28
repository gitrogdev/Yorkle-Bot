const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

const { isPlaying, makeGuess } = require('../handlers/round-handler.js');

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
		await interaction.deferReply();

		const playing = isPlaying(interaction.user);
		if (!playing) {
			interaction.editReply(
				'You must have an active session of Yorkle to use this command!'
			);
			return;
		}

		const guess = interaction.options.getString('song');
		interaction.editReply(await makeGuess(interaction.user, guess));
	}
};