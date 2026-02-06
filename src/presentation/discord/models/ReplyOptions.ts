import type { InteractionReplyOptions, MessagePayload } from 'discord.js';

/**
 * A union of the types which can be used to reply to a message.
 *
 * @author gitrog
 */
export type ReplyOptions = string | MessagePayload | InteractionReplyOptions;