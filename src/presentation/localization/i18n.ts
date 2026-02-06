import fs from 'node:fs';
import { LOCALIZATION_PATH } from '../../config/paths.js';
import path from 'node:path';
import pluralizeEN from './en/pluralize.js';
import pluralizeHR from './hr/pluralize.js';
import pluralizeUK from './uk/pluralize.js';

type Pluralizer = (
	key: string,
	count: number
) => string;

const pluralizeFunctions: Record<string, Pluralizer> = {
	en: pluralizeEN as Pluralizer,
	hr: pluralizeHR as Pluralizer,
	uk: pluralizeUK as Pluralizer
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
 * Gets a record containing all localized options for a key.
 *
 * @author gitrog
 *
 * @param {string} key the translation key
 *
 * @returns {Record<string, string>} a record containing locales as keys and the
 * translations for the provided key as values
 */
export function getLocalizedOptions(key: string): Record<string, string> {
	const options: Record<string, string> = {};
	for (const locale in dictionaries) if (
		locale !== 'en' && Object.hasOwn(dictionaries[locale], key)
	) options[locale] = dictionaries[locale][key];
	return options;
}

/**
 * Localize a string to the provided locale.
 *
 * @author gitrog
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
	if (!Object.hasOwn(dictionaries, lang)) console.log(
		`Attempted to localize the unimplemented locale ${locale}! (${lang})`
	);
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
 * @author gitrog
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
		key,
		count
	);
}