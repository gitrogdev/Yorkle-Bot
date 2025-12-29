const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const { results } = require('../handlers/game-handler');
const { playInGuild } = require('../handlers/guild-handler');

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
		if (interaction.guild !== null) playInGuild(
			interaction.user,
			interaction.guild.id,
			interaction.channelId
		);
		await interaction.deferReply();
		await interaction.editReply(await results(interaction.user));
	}
};