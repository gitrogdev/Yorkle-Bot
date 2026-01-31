import {
	InteractionContextType,
	SlashCommandBuilder,
	type ChatInputCommandInteraction
} from 'discord.js';
import Command from '../models/Command.js';

export default class NewGameCommand extends Command {
	public readonly data: SlashCommandBuilder = new SlashCommandBuilder()
		.setName('yorkle')
		.setDescription(
			'Play a game of Yorkle - the ultimate Yorkiverse guessing game'
		)
		.setContexts(
			InteractionContextType.Guild,
			InteractionContextType.BotDM
		);

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		await this.handler.newGame(interaction);
	}
}