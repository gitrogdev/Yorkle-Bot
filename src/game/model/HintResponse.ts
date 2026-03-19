import type Hint from '../entities/Hint.js';
import type { HintResult } from './HintResult.js';

/**
 * Contains information about the result of a player requesting a hint.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	result: HintResult,
 * 	hint: Hint,
 * }
 */
export default interface HintResponse {
	/**
	 * The result of the hint.
	 *
	 * @see {@link HintResult}
	 */
	result: HintResult,

	/**
	 * The hint given to the player, if any.
	 *
	 * @see {@link Hint}
	 */
	hint?: Hint
}