import {
	ChannelType,
	type ChatInputCommandInteraction
} from 'discord.js';

import type Yorkle from '../../../../game/Yorkle.js';
import {
	getLocaleInfo,
	localePluralize
} from '../../../localization/i18n.js';
import type Messenger from '../Messenger.js';
import SequencePresenter from '../SequencePresenter.js';
import { LyricOption } from '../../../../game/model/LyricOption.js';
import { env } from '../../../../config/env.js';

export default class GameInteractionHandler {
	/**
	 * A presenter to convert sequences saved to file to a human-readable
	 * format.
	 */
	private sequencePresenter: SequencePresenter = new SequencePresenter();

	/**
	 * Creates a new interface for interactions between bot commands and the
	 * Yorkle game.
	 *
	 * @author gitrog
	 *
	 * @param {string} version the version number for the application
	 * @param {Yorkle} game the Yorkle game for the Discord client to interact
	 * with
	 * @param {Messenger} messenger the messenger interface to send messages to
	 * Discord
	 */
	constructor(
		public readonly version: string,
		private game: Yorkle,
		private messenger: Messenger
	) {}

	/**
	 * Responds with a human-readable representation of the contents of the
	 * game.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the content
	 */
	public async getContent(interaction: ChatInputCommandInteraction) {
		const songCount = this.game.countSongs();

		return await this.messenger.localizedReply(
			interaction,
			'game.contents',
			{
				songs: localePluralize(
					interaction.locale,
					'plurals.uniquesong',
					songCount
				)
			}
		);
	}

	/**
	 * Responds with the information about the user's active locale.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting locale info
	 */
	public async getLocaleInfo(interaction: ChatInputCommandInteraction) {
		return await this.messenger.reply(
			interaction, getLocaleInfo(interaction.locale)
		);
	}

	/**
	 * Responds with the information for contacting support.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting support info
	 */
	public async getSupportInfo(interaction: ChatInputCommandInteraction) {
		return await this.messenger.localizedReply(
			interaction,
			'bot.supportinfo',
			{
				dev: `<@${env.DEVELOPER_ID}>`,
				server:
					`https://discord.gg/${env.DEVELOPER_SERVER_INVITE!}`
			}, {
				allowedMentions: { users: [] }
			}
		);
	}

	/**
	 * Responds with the version of Yorkle the bot is currently running on.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the version
	 */
	public async getVersion(interaction: ChatInputCommandInteraction) {
		return await this.messenger.localizedReply(
			interaction, 'bot.version', { version: this.version }
		);
	}

	/**
	 * Responds with a random song lyric.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the lyric
	 * @param {LyricOption} archive the archive to get the lyric from
+	 */
	public async randomLyric(
		interaction: ChatInputCommandInteraction,
		archive: LyricOption
	) {
		return await this.messenger.reply(
			interaction,
			await this.game.randomLyric(archive)
		);
	}

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

	/**
	 * Attempts to share the results for today's game.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user sharing their game results
	 */
	public async shareResults(interaction: ChatInputCommandInteraction) {
		const game = await this.game.getGame();
		const response = game.getResult(interaction.user.id);

		if (interaction.guild) await this.game.joinGuild(
			interaction.guild.id,
			interaction.user.id
		);

		return await this.messenger.localizedReply(
			interaction,
			response.sequence ? 'game.results' : 'errors.hasntplayed',
			{
				day: response.day,
				...(response.sequence ? {
					sequence: this.sequencePresenter.build(response.sequence)
				} : {})
			}
		);
	}

	/**
	 * Responds with the relative time until the game resets.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the time
	 */
	public async whenNext(interaction: ChatInputCommandInteraction) {
		const now = Math.floor(new Date().getTime() / 1000);
		return await this.messenger.localizedReply(
			interaction, 'commands.whennext.response', {
				timestamp: `<t:${now - (now % 86_400) + 86_400}:R>`
			}
		);
	}
}