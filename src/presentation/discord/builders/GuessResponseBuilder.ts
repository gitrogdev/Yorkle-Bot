import { MessageFlags } from 'discord.js';

import type GuessResponse from '../../../game/model/GuessResponse.js';
import { localePluralize, localize } from '../../localization/i18n.js';
import type { SafeReplyOptions } from '../models/SafeReplyOptions.js';
import { GuessResult } from '../../../game/model/GuessResult.js';
import SongEmbedBuilder from './SongEmbedBuilder.js';

export default class GuessResponseBuilder {
	/** Utility class used to build song embeds. */
	private songEmbedder: SongEmbedBuilder = new SongEmbedBuilder();

	/**
	 * Builds the results of a guess and returns it as options to reply to an
	 * interaction with.
	 *
	 * @author gitrog
	 *
	 * @param {string} locale the interaction's locale
	 * @param {string} guess the guess the user made
	 * @param {GuessResponse} response the response returned by the game
	 *
	 * @returns {SafeReplyOptions} options for a payload to send as a reply to
	 * the user
	 */
	public build(
		locale: string,
		guess: string,
		response: GuessResponse
	): SafeReplyOptions {
		if (
			response.result === GuessResult.Correct
			|| response.result === GuessResult.OutOfGuesses
		) {
			if (!response.song) {
				console.warn(
					'Failed to present guess response: Guess result was '
					+ `${response.result}, but no song included in response!`
				);
				return {
					content: localize('errors.commandgeneric', locale),
					flags: MessageFlags.Ephemeral
				}
			}

			return {
				content: localize(
					response.result === GuessResult.Correct
						? 'game.correctguess' : 'game.incorrectguess',
					locale,
					response.result === GuessResult.Correct ? {
						numGuesses: localePluralize(
							locale,
							'plurals.guess',
							response.guesses
						)
					} : { guess: guess }
				) + (response.result === GuessResult.OutOfGuesses ? (
					' ' + localize('game.loss', locale) + '\n\n'
					+ localize('game.nospoilies', locale)
				) : ''),
				...this.songEmbedder.build(response.song)
			};
		} else if (response.result === GuessResult.Incorrect)
			return localize(
				'game.incorrectguess',
				locale,
				{ guess: guess }
			) + ' ' + localize('game.tryagain', locale);
		else return localize(
			`errors.${response.result.toLowerCase()}guess`,
			locale,
			{ guess: guess }
		);
	}
}