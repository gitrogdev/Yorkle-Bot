import type { EditOptions } from './EditOptions.js';
import type { ReplyOptions } from './ReplyOptions.js';

/**
 * A union of the types which can be used to send a reply safely, sending a
 * normal reply if possible, otherwise editing the existing reply.
 *
 * @author gitrog
 */
export type SafeReplyOptions = EditOptions | ReplyOptions;