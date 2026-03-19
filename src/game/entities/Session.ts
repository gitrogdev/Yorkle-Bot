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
import { env } from '../../config/env.js';
import { HintResult } from '../model/HintResult.js';
import type HintResponse from '../model/HintResponse.js';
import Hint from './Hint.js';
import type { HintOption } from '../model/HintOption.js';

export default class Session {
	/** A set of the recognized songs the player has guessed. */
	private guesses: Set<Song> = new Set();

	/** A set of the hints the player has been given. */
	private hints: Set<HintOption> = new Set();

	/**
	 * A sequence of characters representing the player's guesses.
	 *
	 * @see {@link SEQUENCE_CHARACTERS}
	 */
	private guessSequence: string = '';

	/**
	 * Creates a new session of the daily game for an individual user.
	 *
	 * @author gitrog
	 *
	 * @param {UserIdentity} user a representation of the user's information
	 * @param {Game} game the game to launch the session for
	 */
	constructor(
		private user: UserIdentity,
		private game: Game,
		private readonly maxGuesses: number,
		private close: (user: UserIdentity, finished?: boolean) => void
	) {
		console.log(
			`Successfully opened a new session of Yorkle #${game.day} for `
			+ `user ${user.name} with ID ${user.id}.`
		);
	}

	/**
	 * Gets a HintResult judging the player's ability to get a hint based on the
	 * player's previous guesses.
	 *
	 * @author gitrog
	 *
	 * @returns {HintResult} a HintResult judging the player's ability to get a
	 * hint based on the player's previous guesses.
	 */
	private getHintResult(): HintResult {
		if (this.guessSequence.length === 0) return HintResult.First;
		else if (this.guessSequence.length + 1 >= this.maxGuesses)
			return HintResult.Last;
		else {
			for (const char of [...this.guessSequence].reverse())
				if (char === SEQUENCE_CHARACTERS.CORRECT)
					return HintResult.Hinted;
				else if (char === SEQUENCE_CHARACTERS.HINT)
					return HintResult.Double;
			return HintResult.First;
		}
	}

	/**
	 * Gets the information for the next clip of the song.
	 *
	 * @author gitrog
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
	 * @author gitrog
	 *
	 * @returns {number} the day number of the game the session is running
	 */
	public getDay(): number { return this.game.day; }

	/**
	 * Takes and cleans a guess, then returns a formatted response to the user.
	 *
	 * @author gitrog
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
			+ (env.DEV_MODE ? (` Guess: ${guess} (cleaned to `
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
	 * Ends the session without finishing it, allowing it to be reopened.
	 *
	 * @author gitrog
	 */
	public kill() {
		this.close(this.user, false);
	}

	/**
	 * Requests a hint for the puzzle's song based on the player's previous
	 * guesses.
	 *
	 * @author gitrog
	 *
	 * @returns {HintResponse} the response to the user based on whether they
	 * were eligible to receive a hint
	 */
	public requestHint(): HintResponse {
		const result = this.getHintResult();
		const response: HintResponse = { result: result };
		if (result === HintResult.Hinted) {
			const hint = new Hint(this.guesses, this.hints, this.game.song);
			this.hints.add(hint.getKey());
			response.hint = hint;
		}

		this.guessSequence += SEQUENCE_CHARACTERS[result];
		return response;
	}

	/**
	 * Attempts to skip the current clip to receive the next one.
	 * The last clip in the puzzle cannot be skipped.
	 *
	 * @author gitrog
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