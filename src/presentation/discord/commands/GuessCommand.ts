import {
	ChatInputCommandInteraction,
	InteractionContextType,
	SlashCommandBuilder,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';

export default class GuessCommand extends Command {
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName('guess')
			.setDescription('Guess the song from the clip provided')
			.addStringOption((option) => option.setName('song')
				.setDescription('The song title to guess.')
				.setRequired(true)
			)
			.setContexts(
				InteractionContextType.BotDM
			).toJSON();

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		await this.handler.makeGuess(interaction);
	}
}