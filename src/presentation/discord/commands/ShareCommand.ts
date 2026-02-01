import {
	ChatInputCommandInteraction,
	InteractionContextType,
	SlashCommandBuilder,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';

export default class ShareCommand extends Command {
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName('share')
			.setDescription('Share your results for today\'s Yorkle')
			.setContexts(
				InteractionContextType.Guild,
				InteractionContextType.BotDM
			).toJSON();

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		await this.handler.shareResults(interaction);
	}
}