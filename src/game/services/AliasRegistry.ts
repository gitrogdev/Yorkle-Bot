import aliases from '../../config/aliases.json' with { type: 'json' };
import type Song from '../entities/Song.js';
import cleanTitle from '../../util/clean-song.js';
import SongLibrary from './SongLibrary.js';
import pluralize from '../../util/pluralize.js';

export default class AliasRegistry {
	private aliases: Record<string, Song> = {};

	public ready: Promise<void>;

	/**
	 * Create a new registry of aliases to songs.
	 *
	 * @param {SongLibrary} lib the song library to load the songs from
	 */
	constructor(private lib: SongLibrary) {
		this.ready = this.init();
	}

	/**
	 * Initialize the alias registry asynchronously.
	 */
	private async init() {
		await this.lib.ready;

		let loaded = 0;
		for (const [ songTitle, songAliases ] of Object.entries(aliases)) for (
			const alias of songAliases
		) {
			const cleanAlias = cleanTitle(alias);
			if (cleanAlias !== alias) console.warn(
				`The alias "${alias}" is not clean in in aliases.json!`
			);
			if (cleanAlias in this.aliases) throw new Error(
				`Multiple instances of the alias "${cleanAlias}" appear in `
				+ 'aliases.json!'
			); else {
				this.aliases[cleanAlias] = this.lib.getSong(songTitle);
				loaded++
			}
		}
		console.log(
			`Successfully loaded ${pluralize('alias', loaded, 'es')} `
			+ 'from config.'
		);
	}

	/**
	 * Gets the Song Object associated with a given alias.
	 *
	 * @param {string} alias the cleaned song title alias
	 *
	 * @returns {Song} the song associated with the alias
	 */
	public getSongByAlias(alias: string): Song {
		if (!this.isValid(alias)) throw new Error(
			`Unable to find song with the alias "${alias}"`
		);

		return this.aliases[alias];
	}

	/**
	 * Check if a guess for the song is a recognized song.
	 *
	 * @param {string} guess an cleaned song title to check the validity of
	 *
	 * @returns {boolean} whether the guess is a recognized alias
	 */
	public isValid(guess: string): boolean {
		return guess in this.aliases;
	}
}