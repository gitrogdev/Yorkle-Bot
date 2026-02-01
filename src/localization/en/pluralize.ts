/**
 * Returns a word in the correct plural form, based on the count of the object
 * in English.
 *
 * @param {string} word the word in singular form
 * @param {string} count the number of times the word is counted
 * @param {string} plural the word in the plural form
 *
 * @returns {string} the word in the correctly pluralized form preceded by the
 * count (e.g. 5 guesses)
 */
export default function pluralizeEN(
	word: string,
	count: number,
	plural?: string
): string {
	return `${count} ${count === 1 ? word : plural ?? word + 's'}`;
}