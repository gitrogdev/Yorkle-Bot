import path from 'node:path';

import cleanTitle from '../../util/clean-song.js';
import pluralize from '../../util/pluralize.js';
import type ClipInfo from '../model/ClipInfo.js';
import type GuessResponse from '../model/GuessResponse.js';
import { GuessResult } from '../model/GuessResult.js';
import { SEQUENCE_CHARACTERS } from '../model/SequenceCharacters.js';
import type UserIdentity from '../model/UserIdentity.js';
import type Game from './Game.js';
import type Song from './Song.js';
import { DAYS_PATH } from '../../config/paths.js';
import padDay from '../../util/pad-day.js';
import { SkipResult } from '../model/SkipResult.js';
import type SkipResponse from '../model/SkipResponse.js';

export default class Session {
	private guesses: Set<Song> = new Set();
	private guessSequence: string = '';

	/**
	 * Creates a new session of the daily game for an individual user.
	 *
	 * @param {UserIdentity} user a representation of the user's information
	 * @param {Game} game the game to launch the session for
	 */
	constructor(
		private user: UserIdentity,
		private game: Game,
		private readonly maxGuesses: number,
		private close: (user: UserIdentity) => void
	) {
		console.log(
			`Successfully opened a new session of Yorkle #${game.day} for `
			+ `user ${user.name} with ID ${user.id}.`
		);
	}

	/**
	 * Gets the information for the next clip of the song.
	 *
	 * @returns {ClipInfo} information about the next clip of the song
	 */
	public getClip(): ClipInfo {
		const clip = this.guessSequence.length + 1;
		return {
			clip: clip,
			path: path.join(
				DAYS_PATH,
				`day${padDay(this.getDay())}`, `clip${clip}.mp3`
			)
		}
	}

	/**
	 * Gets the day number of the game the session is running.
	 *
	 * @returns {number} the day number of the game the session is running
	 */
	public getDay(): number { return this.game.day; }

	/**
	 * Takes and cleans a guess, then returns a formatted response to the user.
	 *
	 * @param {string} guess the guess received from the user
	 *
	 * @returns {Promise<GuessResponse>} the response to the user based on the
	 * result of the guess
	 */
	public async guess(guess: string): Promise<GuessResponse> {
		const cleanGuess = cleanTitle(guess);
		const guessedSong = this.game.guess(cleanGuess);

		const result = guessedSong === this.game.song ? GuessResult.Correct :
			guessedSong === null ? GuessResult.Invalid :
				this.guesses.has(guessedSong) ? GuessResult.Repeat :
					this.guessSequence.length + 1 >= this.maxGuesses ?
						GuessResult.OutOfGuesses : GuessResult.Incorrect;
		const over = result === GuessResult.Correct ||
			result === GuessResult.OutOfGuesses;

		this.guessSequence += SEQUENCE_CHARACTERS[result];

		console.log(
			`Successfully processed guess from ${this.user.name}.`
			+ (process.env.DEV_MODE ? (` Guess: ${guess} (cleaned to `
			+ `${cleanGuess}), Result: ${result}, `
			+ `Sequence: ${this.guessSequence} (${this.guessSequence.length}/`
			+ `${pluralize('guess', this.maxGuesses, 'es')} remaining)`) : '')
		);

		if (over) {
			await this.game.finish(this.user.id, this.guessSequence);
			this.close(this.user);
		} else if (result === GuessResult.Incorrect)
			this.guesses.add(guessedSong!);

		return {
			day: this.game.day,
			result: result,
			guesses: this.guessSequence.length,
			song: over ? this.game.song : undefined
		};
	}

	/**
	 * Attempts to skip the current clip to receive the next one.
	 * The last clip in the puzzle can not be skipped.
	 *
	 * @returns {SkipResponse} the response to the user based on whether
	 * skipping the song succeeded
	 */
	public skip(): SkipResponse {
		const result = this.guessSequence.length + 1 >= this.maxGuesses ?
			SkipResult.Last : SkipResult.Skip;

		this.guessSequence += SEQUENCE_CHARACTERS[result];

		return {
			result: result,
			clip: this.guessSequence.length + (
				result === SkipResult.Last ? 1 : 0
			)
		};
	}
}