const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const { results } = require('../functions/game-sessions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('share')
		.setDescription('Share your results for today\'s Yorkle')
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
		await interaction.editReply(await results(interaction.user));
	}
};