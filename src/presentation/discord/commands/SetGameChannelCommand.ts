import {
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';
import { getLocalizedOptions, localize } from '../../localization/i18n.js';

export default class SetGameChannelCommand extends Command {
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
				)
			)
			.setContexts(
				InteractionContextType.Guild
			)
			.setDefaultMemberPermissions(
				PermissionFlagsBits.ManageChannels
			).toJSON();

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		await this.handler.setChannel(interaction);
	}
}