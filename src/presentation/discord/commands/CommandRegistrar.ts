import type Command from './Command.js';
import HelloCommand from './HelloCommand.js';
import type CommandRegistry from './CommandRegistry.js';
import pluralize from '../../../util/pluralize.js';

export default class CommandRegistrar {
	private static readonly commandTypes: Array<new () => Command> = [
		HelloCommand
	];

	/**
	 * Builds the commands for the bot and returns an object containing them.
	 *
	 * @returns {CommandRegistry} an object containing the built commands
	 */
	public register(): CommandRegistry {
		const commands: CommandRegistry = {};
		let registered = 0;
		for (const commandType of CommandRegistrar.commandTypes) {
			const command = new commandType();
			commands[command.data.name] = command;
			registered++;
		}
		console.log(
			'Successfully registered '
			+ `${pluralize('Discord slash command', registered)}.`
		);
		return commands;
	}
}