import {
	InteractionContextType,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';
import { getLocalizedOptions, localize } from '../../localization/i18n.js';

export default class NewGameCommand extends Command {
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName(localize('commands.newgame'))
			.setNameLocalizations(getLocalizedOptions('commands.newgame'))
			.setDescription(localize('commands.newgame.description'))
			.setDescriptionLocalizations(
				getLocalizedOptions('commands.newgame.description')
			).setContexts(
				InteractionContextType.Guild,
				InteractionContextType.BotDM
			).toJSON();

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		await this.handler.newGame(interaction);
	}
}