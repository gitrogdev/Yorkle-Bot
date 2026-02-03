import type { User } from 'discord.js';
import type UserIdentity from '../../../game/model/UserIdentity.js';

/**
 * Maps a Discord User object to a UserIdentity interface usable by the game
 * layer.
 *
 * @param {User} user the user to map to a user identity
 *
 * @returns {UserIdentity} the mapped user identity for the user
 */
export default function toUserIdentity(user: User): UserIdentity {
	return {
		name: user.username,
		id: user.id
	}
}