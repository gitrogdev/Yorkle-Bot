import AliasRegistry from '../services/AliasRegistry.js';
import type GameJson from '../../persistence/dto/GameJson.js';
import type GameResults from '../../persistence/dto/GameResults.js';
import { hexify } from '../../util/hex-string.js';
import type Song from './Song.js';
import type GameDataStore from '../../persistence/datastores/GameDataStore.js';
import type ResultsResponse from '../model/ResultsResponse.js';

export default class Game {
	/**
	 * Creates a new representation for a daily iteration of the game
	 *
	 * @param {number} day the number of the day of the game's iteration
	 * @param {Song} song the song to pick the clip from for this day
	 * @param {GameResults} results the results of this day of the
	 * game
	 * @param {AliasRegistry} aliases the alias registry containing the songs
	 * used by the game and their
	 * @param {GameDataStore} store the data store to store game data with
	 */
	constructor(
		public readonly day: number,
		public readonly song: Song,
		private results: GameResults,
		private aliases: AliasRegistry,
		private store: GameDataStore
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
	 * Finishes the game for a user and saves the game data to file.
	 *
	 * @param {number} id the user ID of the user finishing the game
	 * @param {string} sequence the sequence string of guesses the user made
	 */
	public finish(id: string, sequence: string) {
		this.results[id] = { sequence: sequence };
		this.store.save(this);
	}

	/**
	 * Gets the results of a finished game for a user.
	 *
	 * @param {number} id the user ID of the user to get the results for
	 *
	 * @returns {ResultsResponse} the results for the user (if they exist)
	 * including information about the game
	 */
	public getResult(id: string): ResultsResponse {
		return {
			day: this.day,
			sequence: this.hasPlayed(id) ? this.results[id].sequence : undefined
		}
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
			console.error(
				`Failed to process guess "${guess}": Not a recognized alias!`
			);
			return null;
		}

		return this.aliases.getSongByAlias(guess);
	}

	/**
	 * Checks if a user has already played this iteration of the game.
	 *
	 * @param {string} id the user ID to check the game results for
	 *
	 * @returns {boolean} whether the user has already played
	 */
	public hasPlayed(id: string): boolean {
		return id in this.results;
	}
}