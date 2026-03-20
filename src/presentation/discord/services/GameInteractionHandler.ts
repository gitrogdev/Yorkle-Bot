import {
	ChannelType,
	type ChatInputCommandInteraction
} from 'discord.js';

import type Yorkle from '../../../game/Yorkle.js';
import toUserIdentity from '../mappers/to-user-identity.js';
import {
	getLocaleInfo,
	localePluralize,
	localize
} from '../../localization/i18n.js';
import type Messenger from './Messenger.js';
import ClipPresenter from './ClipPresenter.js';
import GuessResponseBuilder from '../builders/GuessResponseBuilder.js';
import SequencePresenter from './SequencePresenter.js';
import { LyricOption } from '../../../game/model/LyricOption.js';
import { GuessResult } from '../../../game/model/GuessResult.js';
import { SkipResult } from '../../../game/model/SkipResult.js';
import { OpenSessionResult } from '../../../game/model/OpenSessionResult.js';
import { env } from '../../../config/env.js';
import { HintResult } from '../../../game/model/HintResult.js';
import type Session from '../../../game/entities/Session.js';

export default class GameInteractionHandler {
	/** The presenter to use to send clips to a user. */
	private clips: ClipPresenter;

	/** The builder used to build responses to users' guesses. */
	private guessBuilder: GuessResponseBuilder = new GuessResponseBuilder();

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
	) {
		this.clips = new ClipPresenter(this.messenger);
	}

	/**
	 * Gets the open session for the user, if it exists.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the session
	 *
	 * @returns {Session | null} the open game session for the user, or null if
	 * none exists
	 */
	private getSession(
		interaction: ChatInputCommandInteraction
	): Session | null {
		const session = this.game.getSession(
			toUserIdentity(interaction.user)
		);

		if (!session) {
			this.messenger.localizedReply(
				interaction, 'errors.nosession'
			);
			return null;
		}

		return session;
	}

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
	 * Makes a guess and presents the response to the user.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user making the guess
	 */
	public async makeGuess(interaction: ChatInputCommandInteraction) {
		const guess = interaction.options.getString('song');
		if (!guess) return await this.messenger.localizedReply(
			interaction, 'errors.noguess'
		);

		const session = this.getSession(interaction);
		if (!session) return;

		const response = await session.guess(guess);

		this.messenger.reply(interaction, this.guessBuilder.build(
			interaction.locale, guess, response
		));

		if (response.result === GuessResult.Incorrect)
			return await this.clips.sendNext(interaction, session);
	}

	/**
	 * Attempts to start a new session of the game for a user.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user starting the game
	 */
	public async newGame(interaction: ChatInputCommandInteraction) {
		const response = await this.game.openSession(
			toUserIdentity(interaction.user)
		);

		if (response.result === OpenSessionResult.Open)
			if (await this.clips.sendNext(
				interaction,
				response.session!
			) === null) {
				response.session!.kill();
				return await this.messenger.localizedReply(
					interaction, 'errors.sessionfailed'
				);
			}
		return await this.messenger.localizedReply(
			interaction,
			response.result === OpenSessionResult.Open ? 'game.sessionopened' :
				response.result === OpenSessionResult.Collision
					? 'errors.sessioncollision' : 'errors.playedtoday'
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
	 * Requests a hint based on the previous guesses.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the hint
	 */
	public async requestHint(interaction: ChatInputCommandInteraction) {
		const session = this.getSession(interaction);
		if (!session) return;

		const response = session.requestHint();

		if (response.result !== HintResult.Hinted)
			return await this.messenger.localizedReply(
				interaction,
				'errors.hint.' + response.result.toLocaleLowerCase()
			);

		const hintParams = response.hint!.getLiteralParams() ?? {};
		for (const [param, [key, count]] of Object.entries(
			response.hint!.getKeyParams() ?? {}
		)) hintParams[param] = (count !== undefined) ? localePluralize(
			interaction.locale, key, count
		) : localize(key, interaction.locale);

		await this.messenger.localizedReply(
			interaction, response.hint!.getKey(), hintParams
		);
		return await this.clips.sendNext(interaction, session);
	}

	/**
	 * Attempts to skip the current clip.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user skipping the clip
	 */
	public async skipGuess(interaction: ChatInputCommandInteraction) {
		const session = this.getSession(interaction);
		if (!session) return;

		const response = session.skip();

		await this.messenger.localizedReply(
			interaction,
			response.result === SkipResult.Skip ? 'game.skipped'
				: 'errors.lastclip',
			{
				clip: response.clip
			}
		);
		if (response.result === SkipResult.Skip)
			return await this.clips.sendNext(interaction, session);
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