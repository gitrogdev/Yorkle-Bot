import {
	ChatInputCommandInteraction,
	InteractionContextType,
	SlashCommandBuilder,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';
import { getLocalizedOptions, localize } from '../../localization/i18n.js';

export default class WhenNextCommand extends Command {
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName(localize('commands.whennext'))
			.setNameLocalizations(getLocalizedOptions('commands.whennext'))
			.setDescription(localize('commands.whennext.description'))
			.setDescriptionLocalizations(
				getLocalizedOptions('commands.whennext.description')
			).setContexts(
				InteractionContextType.Guild,
				InteractionContextType.BotDM
			).toJSON();

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		await this.handler.whenNext(interaction);
	}
}