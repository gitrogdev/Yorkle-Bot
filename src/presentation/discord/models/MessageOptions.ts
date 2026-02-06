import type { MessageCreateOptions, MessagePayload } from 'discord.js';

/**
 * A union of the types which can be used to send a message.
 *
 * @author gitrog
 */
export type MessageOptions = string | MessagePayload | MessageCreateOptions;