import {
	ChatInputCommandInteraction,
	InteractionContextType,
	SlashCommandBuilder,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';
import { getLocalizedOptions, localize } from '../../localization/i18n.js';
import { LyricOption } from '../../../game/model/LyricOption.js';

export default class JudgementCommand extends Command {
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName(localize('commands.judgement'))
			.setNameLocalizations(getLocalizedOptions('commands.judgement'))
			.setDescription(localize('commands.judgement.description'))
			.setDescriptionLocalizations(
				getLocalizedOptions('commands.judgement.description')
			).setContexts(
				InteractionContextType.Guild,
				InteractionContextType.BotDM
			).toJSON();

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		await this.handler.randomLyric(interaction, LyricOption.Judgement);
	}
}