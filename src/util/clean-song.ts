/**
 * Converts a song title to lowercase and strips it of spacing and punctuation
 * for a guess.
 *
 * @author gitrog
 *
 * @param {string} title the song title to clean
 * @returns the cleaned song title
 */
export default function cleanTitle(title: string): string {
	return title.toLowerCase().replace(/[\s.,\-()'/?!]/g, '')
}