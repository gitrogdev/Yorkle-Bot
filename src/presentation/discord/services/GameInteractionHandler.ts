import { type ChatInputCommandInteraction } from 'discord.js';

import type Yorkle from '../../../game/Yorkle.js';
import toUserIdentity from '../mappers/to-user-identity.js';
import { localize } from '../../localization/i18n.js';
import type Messenger from './Messenger.js';
import ClipPresenter from './ClipPresenter.js';
import GuessResponseBuilder from '../builders/GuessResponseBuilder.js';
import SequencePresenter from './SequencePresenter.js';

export default class GameInteractionHandler {
	private clips: ClipPresenter;
	private guessBuilder: GuessResponseBuilder = new GuessResponseBuilder();
	private sequencePresenter: SequencePresenter = new SequencePresenter();

	/**
	 * Creates a new interface for interactions between bot commands and the
	 * Yorkle game.
	 *
	 * @param {Yorkle} game the Yorkle game for the Discord client to interact
	 * with
	 * @param {Messenger} messenger the messenger interface to send messages to
	 * Discord
	 */
	constructor(private game: Yorkle, private messenger: Messenger) {
		this.clips = new ClipPresenter(this.messenger);
	}

	public async getContent(interaction: ChatInputCommandInteraction) {
		const songCount = this.game.countSongs();

		return await this.messenger.reply(interaction, localize(
			'game.contents',
			interaction.locale,
			{ songs: songCount }
		));
	}

	/**
	 * Responds with a random song lyric.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the lyric
+	 */
	public async randomLyric(interaction: ChatInputCommandInteraction) {
		return await this.messenger.reply(
			interaction,
			await this.game.randomLyric()
		);
	}

	/**
	 * Makes a guess and presents the response to the user.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user making the guess
	 */
	public async makeGuess(interaction: ChatInputCommandInteraction) {
		const guess = interaction.options.getString('song');
		const session = this.game.getSession(
			toUserIdentity(interaction.user)
		);

		if (!guess) return await this.messenger.reply(interaction, localize(
			'errors.noguess', interaction.locale
		));

		if (!session) return await this.messenger.reply(interaction, localize(
			'errors.nosession', interaction.locale
		));

		const response = session.guess(guess);

		this.messenger.reply(interaction, this.guessBuilder.build(
			interaction.locale, guess, response
		));

		if (response.result === 'INCORRECT') return await this.clips.sendNext(
			interaction, session
		);
	}

	/**
	 * Attempts to start a new session of the game for a user.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user starting the game
	 */
	public async newGame(interaction: ChatInputCommandInteraction) {
		const response = await this.game.openSession(
			toUserIdentity(interaction.user)
		);

		await this.messenger.reply(interaction, localize(
			response.result === 'OPEN' ? 'game.sessionopened' :
				response.result === 'COLLISION' ? 'errors.sessioncollision' :
					'errors.playedtoday',
			interaction.locale
		));

		if (response.result === 'OPEN') return await this.clips.sendNext(
			interaction, response.session!
		);
	}

	/**
	 * Attempts to set a guild's channel for sharing game results.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user setting the channel
	 */
	public async setChannel(interaction: ChatInputCommandInteraction) {
		if (!interaction.guild) return await this.messenger.reply(interaction,
			localize(
				'errors.commandoutsideguild',
				interaction.locale
			)
		);

		const channel = interaction.options.getChannel('channel')?.id ??
			interaction.channelId;
		const guild = this.game.getGuild(interaction.guild.id);
		if (!guild) return await this.messenger.reply(interaction, localize(
			'errors.noguild',
			interaction.locale
		));

		guild.channelId = channel;
		this.game.saveGuild(interaction.guild.id);

		return await this.messenger.reply(interaction, localize(
			'commands.channelbound',
			interaction.locale,
			{
				channel: `<#${channel}>`
			}
		));
	}

	/**
	 * Attempts to share the results for today's game.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user sharing their game results
	 */
	public async shareResults(interaction: ChatInputCommandInteraction) {
		const game = await this.game.getGame();
		const response = game.getResult(interaction.user.id);

		if (interaction.guild) this.game.joinGuild(
			interaction.guild.id,
			interaction.user.id
		);

		return await this.messenger.reply(interaction, localize(
			response.sequence ? 'game.results' : 'errors.hasntplayed',
			interaction.locale,
			{
				day: response.day,
				...(response.sequence ? {
					sequence: this.sequencePresenter.build(response.sequence)
				} : {})
			}
		));
	}

	/**
	 * Attempts to skip the current clip.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user skipping the clip
	 */
	public async skipGuess(interaction: ChatInputCommandInteraction) {
		const session = this.game.getSession(
			toUserIdentity(interaction.user)
		);

		if (!session) return await this.messenger.reply(interaction, localize(
			'errors.nosession', interaction.locale
		));

		const response = session.skip();

		await this.messenger.reply(interaction, localize(
			response.result === 'SKIP' ? 'game.skipped' : 'errors.lastclip',
			interaction.locale,
			{
				clip: response.clip
			}
		));
		if (response.result === 'SKIP') return await this.clips.sendNext(
			interaction, session
		);
	}

	/**
	 * Responds with the relative time until the game resets.
	 *
	 * @param {ChatInputCommandInteraction} interaction the chat input
	 * interaction with the user requesting the time
	 */
	public async whenNext(interaction: ChatInputCommandInteraction) {
		const now = Math.floor(new Date().getTime() / 1000);
		return await this.messenger.reply(interaction, localize(
			'commands.whennext.response',
			interaction.locale,
			{
				timestamp: `<t:${now - (now % 86_400) + 86_400}:R>`
			}
		));
	}
}