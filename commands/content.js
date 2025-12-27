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
			+ 'Live versions, acoustic versions, remasters, remixes, or any '
			+ 'other alternative versions of songs are not included.\n\n'
			+ '*i.e. Players will not have to distinguish between* **True Love '
			+ 'Waits** *and* **True Love Waits (Live in Oslo)**, *but they '
			+ 'will have to distinguish between* **Morning Bell** *and* '
			+ '**Morning Bell/Amnesiac**.\n\n'
			+ '-# More content will be added over time, potentially including '
			+ 'solo work, as well as On a Friday, The Smile and Atoms for '
			+ 'Peace.'
		);
	}
};