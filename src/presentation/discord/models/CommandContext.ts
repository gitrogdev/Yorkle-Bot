import type ContentInteractionHandler from
	'../services/interactions/ContentInteractionHandler.js';
import type GuildInteractionHandler from
	'../services/interactions/GuildInteractionHandler.js';
import type MetaInteractionHandler from
	'../services/interactions/MetaInteractionHandler.js';
import type SessionInteractionHandler from
	'../services/interactions/SessionInteractionHandler.js';
import type UserInteractionHandler from
	'../services/interactions/UserInteractionHandler.js';

/**
 * Provides the handlers required by commands to perform their operations.
 *
 * Each property corresponds to a specific domain of interaction.
 *
 * @author gitrog
 */
export type CommandContext = {
	/** Related to retrieving and presenting game content. */
	content: ContentInteractionHandler,

	/** Related to managing the options for an individual guild. */
	guild: GuildInteractionHandler,

	/** Related to getting metadata about the bot. */
	meta: MetaInteractionHandler,

	/** Related to an individual game session with a user. */
	session: SessionInteractionHandler,

	/** Related to the data for an individual user. */
	user: UserInteractionHandler
};