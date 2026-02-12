import {
	ChannelType,
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';
import { getLocalizedOptions, localize } from '../../localization/i18n.js';

export default class SetGameChannelCommand extends Command {
	/** The JSON payload used to register the command with the Discord API. */
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName(localize('commands.setgamechannel'))
			.setNameLocalizations(
				getLocalizedOptions('commands.setgamechannel')
			).setDescription(localize('commands.setgamechannel.description'))
			.setDescriptionLocalizations(
				getLocalizedOptions('commands.setgamechannel.description')
			).addChannelOption((option) => option.setName(
				localize('options.channel')
			).setNameLocalizations(getLocalizedOptions('options.channel'))
				.setDescription(localize('commands.setgamechannel.channel'))
				.setDescriptionLocalizations(
					getLocalizedOptions('commands.setgamechannel.channel')
				).addChannelTypes(ChannelType.GuildText)
			)
			.setContexts(
				InteractionContextType.Guild
			)
			.setDefaultMemberPermissions(
				PermissionFlagsBits.ManageChannels
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
		return await this.handler.setChannel(interaction);
	}
}