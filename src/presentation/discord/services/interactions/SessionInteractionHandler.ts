import type { ChatInputCommandInteraction } from 'discord.js';

import type Session from '../../../game/entities/Session.js';
import toUserIdentity from '../mappers/to-user-identity.js';
import { HintResult } from '../../../game/model/HintResult.js';
import { SkipResult } from '../../../game/model/SkipResult.js';
import HintParamsBuilder from '../builders/HintParamsBuilder.js';
import GuessResponseBuilder from '../builders/GuessResponseBuilder.js';
import ClipPresenter from './ClipPresenter.js';
import { OpenSessionResult } from '../../../game/model/OpenSessionResult.js';
import { OpenSessionKeys } from '../models/OpenSessionKeys.js';
import type Yorkle from '../../../game/Yorkle.js';
import type Messenger from './Messenger.js';
import { GuessResult } from '../../../game/model/GuessResult.js';

export default class SessionInteractionHandler {
	/** The presenter to use to send clips to a user. */
	private clips: ClipPresenter;

	/** The builder used to build localization parameters for hints. */
	private hintParamsBuilder: HintParamsBuilder = new HintParamsBuilder();

	/** The builder used to build responses to users' guesses. */
	private guessBuilder: GuessResponseBuilder = new GuessResponseBuilder();

	/**
	 * Creates a new interface for interactions between bot commands and a
	 * session of Yorkle.
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
			interaction, OpenSessionKeys[response.result]
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

		await this.messenger.localizedReply(
			interaction, response.hint!.getKey(),
			this.hintParamsBuilder.build(response.hint!, interaction.locale)
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
}