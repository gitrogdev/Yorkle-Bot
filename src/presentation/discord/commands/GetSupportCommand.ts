import {
	ChatInputCommandInteraction,
	InteractionContextType,
	SlashCommandBuilder,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';
import { getLocalizedOptions, localize } from '../../localization/i18n.js';

export default class GetSupportCommand extends Command {
	/** The JSON payload used to register the command with the Discord API. */
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName(localize('commands.support'))
			.setNameLocalizations(getLocalizedOptions('commands.support'))
			.setDescription(localize('commands.support.description'))
			.setDescriptionLocalizations(
				getLocalizedOptions('commands.support.description')
			).setContexts(
				InteractionContextType.Guild,
				InteractionContextType.BotDM
			).toJSON();

	/**
	 * Executes the command.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the Discord chat command
	 * interaction with the command
	 */
	public async run(interaction: ChatInputCommandInteraction) {
		return await this.handler.getSupportInfo(interaction);
	}
}