import type GameJson from '../../persistence/dto/GameJson.js';
import type GameResults from '../../persistence/dto/GameResults.js';
import SongLibrary from '../../persistence/SongLibrary.js';
import type Song from './Song.js';

export default class Game {
	/**
	 * Creates a new representation for a daily iteration of the game
	 *
	 * @param {number} day the number of the day of the game's iteration
	 * @param {Song} song the song to pick the clip from for this day
	 * @param {number} timestamp the timestamp (in seconds) to start the first
	 * clip of the song
	 * @param {GameResults} results the results of this day of the
	 * game
	 */
	private constructor(
		private day: number,
		private song: Song,
		private timestamp: number,
		private results: GameResults
	) {}

	/**
	 * Factory method to construct a new representation of a daily iteration of
	 * the game from a JSON file.
	 *
	 * @param {GameJson} json the JSON Object to turn into the Game Object
	 *
	 * @returns {Game} the Game Object constructed from the JSON data
	 */
	public static fromJson(json: GameJson): Game {
		return new Game(
			json.day,
			SongLibrary.getSong(json.song),
			json.timestamp,
			json.players
		);
	}
}