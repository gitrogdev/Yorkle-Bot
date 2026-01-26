import fs from 'node:fs';
import { parseFile } from 'music-metadata';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Song from '../game/entities/Song.js';

export default class SongLibrary {
	private static readonly SONGS_PATH: string = '../../songs/';
	private static songs: {
		[filename: string]: Song
	};

	/**
	 * Loads all songs from the /songs directory as Song objects.
	 */
	public static async loadSongs() {
		if (SongLibrary.songs != null) throw new Error(
			'SongLibrary already loaded!'
		);
		SongLibrary.songs = {};

		const songsPath = path.join(
			path.dirname(fileURLToPath(import.meta.url)),
			SongLibrary.SONGS_PATH
		);
		const songFiles = fs.readdirSync(songsPath).filter(
			(file) => file.endsWith('.mp3')
		);
		for (const song of songFiles) {
			const metadata = await parseFile(
				path.join(songsPath, song)
			);
			const { title, artist, album } = metadata.common;
			const duration = metadata.format.duration;
			SongLibrary.songs[song] = new Song(
				title!,
				artist,
				album!,
				song,
				duration!
			);
		}
	}

	/**
	 * Gets a Song Object by filename.
	 *
	 * @param {string} filename the filename of the song to get
	 *
	 * @returns {Song} the Song Object associated with the provided filename
	 */
	public static getSong(filename: string): Song {
		if (!filename.endsWith('.mp3')) filename += '.mp3';
		if (!(filename in SongLibrary.songs)) throw new Error(
			`No song loaded with filename "${filename}"!`
		);
		return SongLibrary.songs[filename];
	}
}