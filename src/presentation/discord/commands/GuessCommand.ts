import {
	ChatInputCommandInteraction,
	InteractionContextType,
	SlashCommandBuilder,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';
import { getLocalizedOptions, localize } from '../../localization/i18n.js';

export default class GuessCommand extends Command {
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName(localize('commands.guess'))
			.setNameLocalizations(getLocalizedOptions('commands.guess'))
			.setDescription(localize('commands.guess.description'))
			.setDescriptionLocalizations(
				getLocalizedOptions('commands.guess.description')
			).addStringOption((option) => option.setName(
				localize('options.song')
			).setNameLocalizations(getLocalizedOptions('options.song'))
				.setDescription(localize('commands.guess.song'))
				.setDescriptionLocalizations(getLocalizedOptions(
					'commands.guess.song'
				))
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