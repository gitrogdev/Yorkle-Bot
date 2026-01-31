import cleanTitle from '../../util/clean-song.js';
import type GuessResponse from '../model/GuessResponse.js';
import { GuessResult } from '../model/GuessResult.js';
import { SEQUENCE_CHARACTERS } from '../model/SequenceCharacters.js';
import type UserIdentity from '../model/UserIdentity.js';
import type Game from './Game.js';
import type Song from './Song.js';

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
		private readonly maxGuesses: number
	) {
		console.log(
			`Successsfully tarted a new session of Yorkle #${game.day} for `
			+ `user ${user.name} with ID ${user.id}.`
		);
	}

	/**
	 * Takes and cleans a guess, then returns a formatted response to the user.
	 *
	 * @param {string} guess the guess received from the user
	 *
	 * @returns {GuessResponse} the response to the user based on the result of
	 * the guess
	 */
	public guess(guess: string): GuessResponse {
		const cleanGuess = cleanTitle(guess);
		const guessedSong = this.game.guess(cleanGuess);

		const result = guessedSong === this.game.song ? GuessResult.Correct :
			guessedSong === null ? GuessResult.Invalid :
				this.guesses.has(guessedSong) ? GuessResult.Repeat :
					this.guessSequence.length + 1 > this.maxGuesses ?
						GuessResult.OutOfGuesses : GuessResult.Incorrect;
		const over = result === GuessResult.Correct ||
			result === GuessResult.OutOfGuesses;

		this.guessSequence += SEQUENCE_CHARACTERS[result];

		if (result === GuessResult.Incorrect) this.guesses.add(guessedSong!);
		else if (over) console.log('placeholder');

		return {
			day: this.game.day,
			result: result,
			song: over ? this.game.song : undefined
		};
	}
}