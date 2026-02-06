import type Command from './Command.js';

/** A command registered under its command name. */
type RegisteredCommand = Command;

/**
 * Contains all commands accessible through their command names.
 *
 * @author gitrog
 */
export default interface CommandRegistry {
	/** An associative array of command names to commands. */
	[
		/** The name for a command */
		commandName: string
	]: RegisteredCommand
}