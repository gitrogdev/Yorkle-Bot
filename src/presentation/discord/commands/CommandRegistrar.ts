import type Command from './Command.js';
import HelloCommand from './HelloCommand.js';
import type CommandRegistry from './CommandRegistry.js';
import pluralize from '../../../util/pluralize.js';
import type Yorkle from '../../../game/Yorkle.js';
import {
	REST,
	Routes,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';

export default class CommandRegistrar {
	private static readonly COMMAND_TYPES: Array<
		new (game: Yorkle) => Command
	> = [
			HelloCommand
		];
	private readonly rest: REST;

	/**
	 * Creates a new command registrar.
	 *
	 * @param {string} token the Discord bot's secret token
	 * @param {string} appId the application ID of the Discord application
	 */
	constructor(token: string, private appId: string) {
		this.rest = new REST().setToken(token);
	}

	/**
	 * Deploys the registered commands to Discord.
	 *
	 * @param {RESTPostAPIChatInputApplicationCommandsJSONBody[]} commands an
	 * array of JSON data for the registered commands to deploy to Discord
	 */
	private async deploy(
		commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]
	) {
		await this.rest.put(
			Routes.applicationCommands(this.appId),
			{ body: commands }
		);

		console.log(
			`Successfully deployed ${pluralize('command', commands.length)} `
			+ 'to Discord!'
		);
	}

	/**
	 * Builds the commands for the bot and returns an object containing them.
	 *
	 * @returns {CommandRegistry} an object containing the built commands
	 */
	public register(game: Yorkle): CommandRegistry {
		const commands: CommandRegistry = {};
		const registered = [];
		for (const commandType of CommandRegistrar.COMMAND_TYPES) {
			const command = new commandType(game);
			commands[command.data.name] = command;
			registered.push(command.data.toJSON());
		}
		console.log(
			'Successfully registered '
			+ `${pluralize('Discord slash command', registered.length)}.`
		);

		this.deploy(registered);

		return commands;
	}
}