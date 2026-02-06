import DICTIONARY from './plurals.json' with { type: 'json' };

type PluralKey = keyof typeof DICTIONARY;
const GEN_SINGULAR = new Set<number>([2, 3, 4]);

/**
 * Returns a word in the correct plural form, based on the count of the object
 * in Croatian.
 *
 * @author gitrog
 *
 * @param {PluralKey} key the translation key for the word in singular form
 * @param {string} count the number of times the word is counted
 *
 * @returns {string} the word in the correctly pluralized form preceded by the
 * count (e.g. 5 pokušaja)
 */
export default function pluralizeHR(
	key: PluralKey,
	count: number
): string {
	return `${count} ${
		count % 10 === 1 && count % 100 !== 11 ? DICTIONARY[key] :
			GEN_SINGULAR.has(count % 10) && ((count % 10) + 10 !== count % 100)
				? DICTIONARY[key + '.gensing' as PluralKey] :
				DICTIONARY[key + '.genplural' as PluralKey]
	}`;
}