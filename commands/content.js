const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const COUNT = Object.keys(require('../config/aliases.json')).length;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('content')
		.setDescription('Get information on the content known by Yorkle.')
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
			`Yorkle currently recognizes \`${COUNT}\` songs from Radiohead `
			+ 'studio albums, B-sides, singles, and other releases.\n\n'
			+ '-# More content will be added over time, potentially including '
			+ 'solo work, as well as The Smile and Atoms for Peace.'
		);
	}
};