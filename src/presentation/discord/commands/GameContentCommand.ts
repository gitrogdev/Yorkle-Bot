import {
	ChatInputCommandInteraction,
	InteractionContextType,
	SlashCommandBuilder,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';
import { getLocalizedOptions, localize } from '../../localization/i18n.js';

export default class GameContentCommand extends Command {
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName(localize('commands.content'))
			.setNameLocalizations(getLocalizedOptions('commands.content'))
			.setDescription(localize('commands.content.description'))
			.setDescriptionLocalizations(
				getLocalizedOptions('commands.content.description')
			).setContexts(
				InteractionContextType.Guild,
				InteractionContextType.BotDM
			).toJSON();

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		await this.handler.getContent(interaction);
	}
}