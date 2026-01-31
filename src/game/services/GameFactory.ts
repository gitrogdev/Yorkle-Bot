import type GameDataStore from '../../persistence/datastores/GameDataStore.js';
import type GameJson from '../../persistence/dto/GameJson.js';
import { dehexify } from '../../util/hex-string.js';
import type AliasRegistry from './AliasRegistry.js';
import type SongLibrary from './SongLibrary.js';
import Game from '../entities/Game.js';
import type Song from '../entities/Song.js';

export default class GameFactory {
	/**
	 * Creates a new helper class to build games from JSON files.
	 *
	 * @param {SongLibrary} songs the song library to use for the games
	 * @param {AliasRegistry} aliases the registry of aliases to songs to use
	 * for guesses
	 * @param {GameDataStore} store the data store to store game data with
	 */
	constructor(
		private songs: SongLibrary,
		private aliases: AliasRegistry,
		private store: GameDataStore
	) {}

	/**
	 * Creates a new game for a given song and day.
	 *
	 * @param {number} day the number of the day of the game's iteration
	 * @param {Song} song the song to pick the clip from for this day
	 *
	 * @returns {Game} the game created
	 */
	public createGame(day: number, song: Song): Game {
		return new Game(day, song, {}, this.aliases, this.store);
	}

	/**
	 * Factory method to construct a new representation of a daily iteration of
	 * the game from a JSON file.
	 *
	 * @param {GameJson} json the JSON Object to turn into the Game Object
	 *
	 * @returns {Game} the Game Object constructed from the JSON data
	 */
	public fromJson(json: GameJson): Game {
		return new Game(
			json.day,
			this.songs.getSong(dehexify(json.song)),
			json.players,
			this.aliases,
			this.store
		);
	}
}