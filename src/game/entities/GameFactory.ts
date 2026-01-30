import type GameJson from '../../persistence/dto/GameJson.js';
import { dehexify } from '../../util/hex-string.js';
import type AliasRegistry from '../services/AliasRegistry.js';
import type SongLibrary from '../services/SongLibrary.js';
import Game from './Game.js';

export default class GameFactory {
	/**
	 * Creates a new helper class to build games from JSON files.
	 *
	 * @param {SongLibrary} songs the song library to use for the games
	 * @param {AliasRegistry} aliases the registry of aliases to songs to use
	 * for guesses
	 */
	constructor(private songs: SongLibrary, private aliases: AliasRegistry) {}

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
			json.timestamp,
			json.players,
			this.aliases
		);
	}
}