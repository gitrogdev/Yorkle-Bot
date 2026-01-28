import type Command from './Command.js';

export default interface CommandRegistry {
	[commandName: string]: Command
}