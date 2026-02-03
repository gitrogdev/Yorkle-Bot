import {
	ChatInputCommandInteraction,
	InteractionContextType,
	SlashCommandBuilder,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';
import { getLocalizedOptions, localize } from '../../localization/i18n.js';

export default class SkipCommand extends Command {
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName(localize('commands.skip'))
			.setNameLocalizations(getLocalizedOptions('commands.skip'))
			.setDescription(localize('commands.skip.description'))
			.setDescriptionLocalizations(
				getLocalizedOptions('commands.skip.description')
			).setContexts(
				InteractionContextType.BotDM
			).toJSON();

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		await this.handler.skipGuess(interaction);
	}
}