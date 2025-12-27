const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nextgame')
		.setDescription('Calculates the time remaining until the next puzzle.')
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
		const now = Math.floor(new Date().getTime() / 1000);
		await interaction.reply(
			'The next Yorkle will be available <t:'
			+ `${now - (now % 86400) + 86400}:R>`
		);
	}
};