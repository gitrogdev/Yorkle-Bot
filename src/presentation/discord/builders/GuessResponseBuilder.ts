import { AttachmentBuilder } from 'discord.js';
import path from 'node:path';

import type GuessResponse from '../../../game/model/GuessResponse.js';
import { localePluralize, localize } from '../../localization/i18n.js';
import type { SafeReplyOptions } from '../models/SafeReplyOptions.js';
import { MEDIA_ROOT } from '../../../config/paths.js';

export default class GuessResponseBuilder {
	/**
	 * Builds the results of a guess and returns it as options to reply to an
	 * interaction with.
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
			response.result === 'CORRECT' || response.result === 'NOGUESSES'
		) {
			if (!response.song) {
				console.warn(
					'Failed to present guess response: Guess result was '
					+ `${response.result}, but no song included in response!`
				);
				return {
					content: localize('errors.commandgeneric', locale),
					ephemeral: true
				}
			}

			return {
				content: localize(
					response.result === 'CORRECT' ? 'game.correctguess' :
						'game.incorrectguess',
					locale,
					response.result === 'CORRECT' ? {
						numGuesses: localePluralize(
							locale,
							'plurals.guess',
							response.guesses
						)
					} : { guess: guess }
				) + (response.result === 'NOGUESSES' ? (
					' ' + localize('game.loss', locale) + '\n\n'
					+ localize('game.nospoilies', locale)
				) : ''),
				embeds: [{
					author: {
						name: response.song.artist
					},
					title: response.song.title,
					description: response.song.album,
					thumbnail: {
						url: `attachment://${response.song.thumbnail}`
					}
				}],
				files: [new AttachmentBuilder(path.join(
					MEDIA_ROOT, response.song.thumbnail
				))]
			};
		} else if (response.result === 'INCORRECT')
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