import Song from '../entities/Song.js';
import shuffleArray from '../../util/shuffle-array.js';
import type SongDataStore from '../../persistence/datastores/SongDataStore.js';

export default class SongLibrary {
	private static readonly REQUIRED_FIELDS: (
		'title' | 'album' | 'duration'
	)[] = ['title', 'album', 'duration'];

	private size: number = 0;
	private songs: Record<string, Song> = {};

	public readonly ready: Promise<void>;

	/**
	 * Loads all the songs from the provided data store as Song objects.
	 *
	 * @param {SongQueueStore} store the data store to load the songs from
	 */
	constructor(private store: SongDataStore) {
		this.ready = this.init();
	}

	/**
	 * Initialize the song library asynchronously.
	 */
	private async init() {
		const songs = await this.store.load();

		for (const metadata of songs) {
			for (const field of SongLibrary.REQUIRED_FIELDS)
				if (!(metadata[field])) {
					console.warn(
						`Failed to find ${field} for ${metadata.song}!`
					);
					continue;
				}

			this.songs[metadata.song] = new Song(
				metadata.title!,
				metadata.artist,
				metadata.album!,
				metadata.song,
				metadata.duration!
			);
			this.size++;
		}

		console.log(
			`Successfully loaded ${this.size} song${this.size === 1 ? '' : 's'}`
			+ ' from local files.'
		);
	}

	/**
	 * Returns an array of songs not present in an array of song filenames.
	 *
	 * @param {string[]} filenames the filenames of the songs to compare to the
	 * song library
	 *
	 * @returns {Song[]} the songs not present in the given array
	 */
	public getNewSongs(filenames: string[]): Song[] {
		const libFilenames = Object.keys(this.songs);
		const missing = libFilenames.filter(
			song => !new Set(filenames).has(song)
		);

		const newSongs = [];
		for (const song of missing) newSongs.push(this.songs[song]);
		return newSongs;
	}

	/**
	 * Gets the number of songs in the song library.
	 *
	 * @returns {number} the number of songs in the song library
	 */
	public getSize(): number { return this.size; }

	/**
	 * Gets a Song Object by filename.
	 *
	 * @param {string} filename the filename of the song to get
	 *
	 * @returns {Song} the Song Object associated with the provided filename
	 */
	public getSong(filename: string): Song {
		if (!filename.endsWith('.mp3')) filename += '.mp3';
		if (!(filename in this.songs)) throw new Error(
			`No song loaded with filename "${filename}"!`
		);
		return this.songs[filename];
	}

	/**
	 * Returns a shuffled array of all the songs in the song library.
	 *
	 * @returns {Song[]} a shuffled array of all the songs in the song library.
	 */
	public shuffle(): Song[] {
		const songs = Object.values(this.songs);
		shuffleArray(songs);
		return songs;
	}
}