/**
 * A minimalized presentaion-agnostic representation of a user interacting with
 * the game.
 *
 * @author gitrog
 *
 * @example
 * {
 * 	name: 'gitrog',
 * 	id: '1234567890'
 * }
 */
export default interface UserIdentity {
	/** The user's human-readable username or other handle. */
	name: string,

	/** A unique identifier for the user. */
	id: string
}