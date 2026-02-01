import fs from 'node:fs';
import { LOCALIZATION_PATH } from '../config/paths.js';
import path from 'node:path';

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
export function localize(
	key: string,
	locale: string = 'en-US',
	params: Record<string, string | number> = {}
): string {
	const lang = locale.split('-')[0];
	const dict = dictionaries[lang] ?? dictionaries['en'] ?? {};

	const template = dict[key] ?? key;
	return template.replace(/\{(\w+)\}/g, (_, name) =>
		params[name] !== undefined ? String(params[name]) : `{${name}}`
	);
}