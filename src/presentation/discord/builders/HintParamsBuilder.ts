import type Hint from '../../../game/entities/Hint.js';
import { localePluralize, localize } from '../../localization/i18n.js';

/**
 * Utility class used to build localization parameters based off of a hint.
 *
 * @author gitrog
 */
export default class HintParamsBuilder {
	/**
	 * Builds a record containing the parameters to be passed to the
	 * localization for a {@link Hint} based on its literal parameters and
	 * parameters to be localized.
	 *
	 * @author gitrog
	 *
	 * @param {Hint} hint the hint to build the localization parameters for
	 * @param {string} locale the locale to translate the hint into
	 *
	 * @returns {Record<string, string>} localization parameters containing the
	 * contents of the hint
	 */
	public build(hint: Hint, locale: string): Record<string, string> {
		const hintParams = hint.getLiteralParams() ?? {};

		for (const [param, [key, count]] of Object.entries(
			hint.getKeyParams() ?? {}
		)) hintParams[param] = (count !== undefined) ? localePluralize(
			locale, key, count
		) : localize(key, locale);

		return hintParams;
	}
}