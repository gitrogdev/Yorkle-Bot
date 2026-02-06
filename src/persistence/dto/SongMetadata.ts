/**
 * Information about the .mp3 metadata for a song.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	title: 'Where I End and You Begin (The Sky is Falling in)',
 * 	artist: 'Radiohead',
 * 	album: 'Hail to the Thief',
 * 	song: 'whereiend.mp3',
 * 	duration: 269.1657142857143
 * }
 */
export default interface SongMetadata {
	/** The title of the song. */
	title: string | undefined,

	/** The artist(s) of the song. */
	artist: string | undefined,

	/** The album or other release that the song is on. */
	album: string | undefined,

	/** The filename of the song, including the .mp3 extension. */
	song: string,

	/** The duration of the song, in seconds. */
	duration: number | undefined
}