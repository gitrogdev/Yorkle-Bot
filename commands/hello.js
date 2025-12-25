const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('hello').setDescription('hi thm'),
	async execute(interaction) {
		await interaction.reply('aaaonnnooohhoonnnnoohhoonnoohho (kidaee kidaee kidaee baba) aoohnnoohooonnhhnooaaohoonnhhoohooaoohoonooo(kidaee kidaee kidaee baba)');
	}
};