import aliases from '../config/aliases.json' with { type: 'json' };
import type Song from '../game/entities/Song.js';
import cleanTitle from '../util/clean-song.js';
import SongLibrary from './SongLibrary.js';

export default class AliasRegistry {
	private static aliases: {
		[alias: string]: Song
	};

	/**
	 * Loads all the aliases from /config/aliases.json as a set.
	 */
	public static loadAliases() {
		if (AliasRegistry.aliases != null) throw new Error(
			'AliasRegistry already loaded!'
		);
		AliasRegistry.aliases = {};

		for (const [ songTitle, songAliases ] of Object.entries(aliases))
			for (const alias of songAliases) {
				const cleanAlias = cleanTitle(alias);
				if (cleanAlias !== alias) console.warn(
					`The alias "${alias}" is not clean in in aliases.json!`
				);
				if (cleanAlias in aliases) throw new Error(
					`Multiple instances of the alias "${cleanAlias}" appear in `
					+ 'aliases.json!'
				); else AliasRegistry.aliases[cleanAlias] = SongLibrary.getSong(
					songTitle
				);
			}
	}

	/**
	 * Check if a guess for the song is a recognized song.
	 *
	 * @param {string} guess an cleaned song title to check the validity of
	 *
	 * @returns {boolean} whether the guess is a recognized alias
	 */
	public static isValid(guess: string): boolean {
		return guess in AliasRegistry.aliases;
	}
}