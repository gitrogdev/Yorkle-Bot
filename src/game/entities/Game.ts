import AliasRegistry from '../services/AliasRegistry.js';
import type GameJson from '../../persistence/dto/GameJson.js';
import type GameResults from '../../persistence/dto/GameResults.js';
import { hexify } from '../../util/hex-string.js';
import type Song from './Song.js';

export default class Game {
	/**
	 * Creates a new representation for a daily iteration of the game
	 *
	 * @param {number} day the number of the day of the game's iteration
	 * @param {Song} song the song to pick the clip from for this day
	 * @param {GameResults} results the results of this day of the
	 * game
	 * @param {AliasRegistry} aliases the alias registry containing the songs
	 * used by the game and their aliases
	 */
	constructor(
		public readonly day: number,
		public readonly song: Song,
		private results: GameResults,
		private aliases: AliasRegistry
	) {
		if (process.env.DEV_MODE) console.log(
			`Successfully started game Yorkle #${day} with `
			+ `"${song.artist} - ${song.title}"`
		);
	}

	/**
	 * Returns a JSON representation of the game's data.
	 *
	 * @returns {GuildJson} the JSON representation of the game's data.
	 */
	public toJson(): GameJson {
		return {
			day: this.day,
			song: hexify(this.song.filename),
			players: this.results
		};
	}

	/**
	 * Makes a guess for the game's song, checking if the song title is valid
	 * (if it is a known song title) and correct (if it is the correct song for
	 * this iteration of the game).
	 *
	 * @param {string} guess the cleaned song title the player guessed
	 *
	 * @returns {Song | null} the Song the player guessed, or `null` if
	 * the song title is not recognized
	 */
	public guess(guess: string): Song | null {
		if (!this.aliases.isValid(guess)) {
			console.warn(
				`Failed to process guess "${guess}": Not a recognized alias!`
			);
			return null;
		}

		return this.aliases.getSongByAlias(guess);
	}
}