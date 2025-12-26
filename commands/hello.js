const { SlashCommandBuilder, InteractionContextType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('hi thm')
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
		await interaction.reply(
			'aaaonnnooohhoonnnnoohhoonnoohho (kidaee kidaee kidaee baba) '
			+ 'aoohnnoohooonnhhnooaaohoonnhhoohooaoohoonooo(kidaee kidaee '
			+ 'kidaee baba)'
		);
	}
};