import fs from 'node:fs';
import { LOCALIZATION_PATH } from '../config/paths.js';
import path from 'node:path';
import pluralizeEN from './en/pluralize.js';

type Pluralizer = (
	word: string,
	count: number,
	plural: string
) => string;

const pluralizeFunctions: Record<string, Pluralizer> = {
	en: pluralizeEN
};

const dictionaries: Record<string, Record<string, string>> = {};
for (const locale of fs.readdirSync(LOCALIZATION_PATH)) {
	const localeDir = path.join(LOCALIZATION_PATH, locale);

	if (!fs.statSync(localeDir).isDirectory()) continue;

	dictionaries[locale] = {};
	for (const file of fs.readdirSync(localeDir)) {
		if (!file.endsWith('.json')) continue;

		const filePath = path.join(localeDir, file);
		dictionaries[locale] = {
			...dictionaries[locale],
			...JSON.parse(fs.readFileSync(filePath, 'utf-8'))
		};
		console.log(`Successfully loaded dictionary /${locale}/${file}.`);
	}
}

/**
 * Localize a string to the provided locale.
 *
 * @param {string} key the translation key
 * @param {string} locale the locale to translate into (defaults to en-US)
 * @param {Record<string, string | number>} params the parameters to replace
 * within the string
 *
 * @returns {string} the localized string
 */
function localize(
	key: string,
	locale: string = 'en-US',
	params: Record<string, string | number> = {}
): string {
	const lang = locale.split('-')[0];
	const dict = (dictionaries[lang] && key in dictionaries[lang])
		? dictionaries[lang] : dictionaries['en'] ?? {};

	const template = dict[key] ?? key;
	return template.replace(/\{(\w+)\}/g, (_, name) =>
		params[name] !== undefined ? String(params[name]) : `{${name}}`
	);
}

export { localize };

/**
 * Returns a word in the correct plural form, based on the count of the object.
 *
 * @param {string} locale the locale to apply pluralization rules for (defaults
 * to en-US)
 * @param {string} key the translation key of the word to put into plural form
 * @param {number} count the count of the word (will pluralize if not 1 or -1)
 *
 * @returns {string} the correctly pluralized form of the word, with the count
 * at the beginning (e.g. 3 beans)
 */
export function localePluralize(
	locale: string,
	key: string,
	count: number
): string {
	const lang = locale.split('-')[0];
	return (
		(pluralizeFunctions[lang] && key in dictionaries[lang])
			? pluralizeFunctions[lang] : pluralizeFunctions.en
	)(
		localize(key, locale),
		count,
		localize(`${key}.plural`, locale)
	);
}