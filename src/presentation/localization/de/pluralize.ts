import DICTIONARY from './plurals.json' with { type: 'json' };

type PluralKey = keyof typeof DICTIONARY;

/**
 * Returns a word in the correct plural form, based on the count of the object
 * in German.
 *
 * @author gitrog
 *
 * @param {PluralKey} key the translation key for the word in singular form
 * @param {string} count the number of times the word is counted
 *
 * @returns {string} the word in the correctly pluralized form preceded by the
 * count (e.g. 5 Versuche)
 */
export default function pluralizeDE(
	key: PluralKey,
	count: number
): string {
	return `${count} ${
		count === 1 ? DICTIONARY[key as PluralKey] :
			DICTIONARY[key + '.plural' as PluralKey]
	}`;
}