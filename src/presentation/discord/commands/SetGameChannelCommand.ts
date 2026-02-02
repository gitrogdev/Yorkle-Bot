import {
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';

export default class SetGameChannelCommand extends Command {
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName('setgamechannel')
			.setDescription(
				'Sets the channel for the bot to share results to.'
			)
			.setContexts(
				InteractionContextType.Guild
			)
			.addChannelOption((option) => option.setName('channel')
				.setDescription('The channel for the bot to share results to.')
			)
			.setDefaultMemberPermissions(
				PermissionFlagsBits.ManageChannels
			).toJSON();

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();
		await this.handler.setChannel(interaction);
	}
}