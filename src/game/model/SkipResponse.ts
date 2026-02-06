import type { SkipResult } from './SkipResult.js';

/**
 * Contains information about the game's response to a player skipping a clip.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	result: SkipResult
 * 	clip: 3
 * }
 */
export default interface SkipResponse {
	/**
	 * The result of attempting to skip the clip.
	 *
	 * @see {@link SkipResult}
	 */
	result: SkipResult,

	/**
	 * The position of the clip which the player attempted to skip in the
	 * playback order of the game session.
	 */
	clip: number
}