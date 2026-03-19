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
 * 	clip: 2
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
	hint?: Hint,

	/**
	 * The position of the clip which the player attempted to get a hint for in
	 * the playback order of the game session.
	 */
	clip: number
}