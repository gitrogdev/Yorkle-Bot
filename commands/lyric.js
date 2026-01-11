const { SlashCommandBuilder, InteractionContextType } = require('discord.js');
const lyrics = require('../handlers/lyrics-handler');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lyric')
		.setDescription('Replies with a random song lyric.')
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
			lyrics[Math.floor(Math.random() * lyrics.length)]
		).catch((err) => {
			console.error(`Failed to respond to /lyric interaction: ${err}`);
		});
	}
};