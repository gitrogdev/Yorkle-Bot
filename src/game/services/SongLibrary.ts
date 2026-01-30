import Song from '../entities/Song.js';
import shuffleArray from '../../util/shuffle-array.js';
import type SongDataStore from '../../persistence/datastores/SongDataStore.js';

export default class SongLibrary {
	private static readonly REQUIRED_FIELDS: (
		'title' | 'album' | 'duration'
	)[] = ['title', 'album', 'duration'];

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

		let loaded = 0;
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
			loaded++;
		}

		console.log(
			`Successfully loaded ${loaded} song${loaded === 1 ? '' : 's'} from `
			+ 'local files.'
		);
	}

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