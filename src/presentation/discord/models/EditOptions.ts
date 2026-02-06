import type { InteractionEditReplyOptions, MessagePayload } from 'discord.js';

/**
 * A union of the types which can be used to edit a message.
 *
 * @author gitrog
 */
export type EditOptions = string | MessagePayload | InteractionEditReplyOptions;