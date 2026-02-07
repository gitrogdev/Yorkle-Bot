import path from 'node:path';

import albums from '../../config/albums.json' with { type: 'json' };
import aliases from '../../config/aliases.json' with { type: 'json' };

export default class Song {
	/** A set of the recognized aliases for guessing the song. */
	private readonly aliases: Set<string>;

	/**
	 * The filename of the thumbnail art for the song, including the .jpg
	 * extension.
	 */
	public readonly thumbnail: string;

	/**
	 * Creates a new representation of the data for a song.
	 *
	 * @author gitrog
	 *
	 * @param {string} title the title of the song
	 * @param {string} artist the artist (or artists) of the song
	 * @param {string} album the album the song is on
	 * @param {string} filename the file name of the song
	 * @param {number} length the length of the song (in seconds)
	 */
	constructor(
		public readonly title : string,
		public readonly artist : string = 'Radiohead',
		public readonly album: string,
		public readonly filename: string,
		public readonly length: number
	) {
		if (!(album in albums)) throw new Error(`Unknown album "${album}"!`);
		this.thumbnail = albums[album as keyof typeof albums] + '.jpg';

		const key = path.parse(filename).name;
		if (!(key in aliases)) throw new Error(
			`Unknown song "${key}"! (${artist} - ${title} (${album}))`
		);
		this.aliases = new Set(aliases[key as keyof typeof aliases]);
	}

	/**
	 * Checks if a guess is an alias of this song.
	 *
	 * @author gitrog
	 *
	 * @param {string} guess the guess to check this song's aliases for
	 *
	 * @returns {boolean} whether the guess is an alias of this song
	 */
	public isAlias(guess: string): boolean {
		return this.aliases.has(guess);
	}
}