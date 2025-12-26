const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('hi thm'),
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