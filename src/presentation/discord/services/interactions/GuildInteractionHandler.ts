import {
	ChannelType,
	type ChatInputCommandInteraction
} from 'discord.js';

import type Yorkle from '../../../../game/Yorkle.js';
import type Messenger from '../Messenger.js';

export default class GuildInteractionHandler {
	/**
	 * Creates a new interface for interactions between bot commands and a
	 * Discord guild running Yorkle.
	 *
	 * @author gitrog
	 *
	 * @param {Yorkle} game the Yorkle game for the Discord client to interact
	 * with
	 * @param {Messenger} messenger the messenger interface to send messages to
	 * Discord
	 */
	constructor(
		private game: Yorkle,
		private messenger: Messenger
	) {}

	/**
	 * Attempts to set a guild's channel for sharing game results.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user setting the channel
	 */
	public async setChannel(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild) return await this.messenger.localizedReply(
			interaction, 'errors.commandoutsideguild'
		);

		const channel = interaction.options.getChannel('channel') ??
			interaction.channel;

		if (
			(!channel || channel.type !== ChannelType.GuildText)
		) return await this.messenger.localizedReply(
			interaction, 'errors.setnontextchannel'
		);

		const channelId = channel!.id;

		const guild = this.game.getGuild(interaction.guild.id)
			?? this.game.createGuild(interaction.guild.id);

		guild.channelId = channelId;
		await this.game.saveGuild(interaction.guild.id);

		return await this.messenger.localizedReply(
			interaction, 'commands.channelbound', {
				channel: `<#${channelId}>`
			}
		);
	}
}