/**
 * Returns a word in the correct plural form, based on the count of the object.
 *
 * @param {string} word the word to put in plural form
 * @param {number} count the count of the word (will pluralize if not 1 or -1)
 * @param {string} plural the ending to add to the plural form of the word, or
 * the word to replace the word with if replace is true. (Defaults to 's')
 * @param {boolean} replace whether to replace the entire word with the plural
 * form if plural. (Defaults to false) (e.g. 1 goose -> 2 geese)
 *
 * @returns {string} the correctly pluralized form of the word, with the count
 * at the beginning (e.g. 3 beans)
 */
export default function pluralize(
	word: string, count: number, plural: string = 's', replace: boolean = false
): string {
	count = Math.abs(count);
	return `${count} ${(replace && count !== 1) ? plural : word}`
		+ `${(replace || count === 1) ? '' : plural}`;
}