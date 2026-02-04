import {
	REST,
	Routes,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';

import type Command from '../models/Command.js';
import type CommandRegistry from '../models/CommandRegistry.js';
import pluralize from '../../../util/pluralize.js';
import NewGameCommand from '../commands/NewGameCommand.js';
import type GameInteractionHandler from './GameInteractionHandler.js';
import GuessCommand from '../commands/GuessCommand.js';
import SkipCommand from '../commands/SkipCommand.js';
import ShareCommand from '../commands/ShareCommand.js';
import SetGameChannelCommand from '../commands/SetGameChannelCommand.js';
import WhenNextCommand from '../commands/WhenNextCommand.js';
import RandomLyricCommand from '../commands/RandomLyricCommand.js';
import GameContentCommand from '../commands/GameContentCommand.js';
import JudgementCommand from '../commands/JudgementCommand.js';
import GetVersionCommand from '../commands/GetVersion.js';

export default class CommandRegistrar {
	private static readonly COMMAND_TYPES: Array<
		new (handler: GameInteractionHandler) => Command
	> = [
			NewGameCommand,
			GuessCommand,
			SkipCommand,
			ShareCommand,
			SetGameChannelCommand,
			WhenNextCommand,
			RandomLyricCommand,
			GameContentCommand,
			JudgementCommand,
			GetVersionCommand
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
			+ 'to Discord.'
		);
	}

	/**
	 * Builds the commands for the bot and returns an object containing them.
	 *
	 * @param {GameInteractionHandler} handler the handler for connecting
	 * Discord interactions to the game logic
	 *
	 * @returns {CommandRegistry} an object containing the built commands
	 */
	public register(handler: GameInteractionHandler): CommandRegistry {
		const commands: CommandRegistry = {};
		const registered = [];
		for (const commandType of CommandRegistrar.COMMAND_TYPES) {
			const command = new commandType(handler);
			commands[command.data.name] = command;
			registered.push(command.data);
		}
		console.log(
			'Successfully registered '
			+ `${pluralize('Discord slash command', registered.length)}.`
		);

		this.deploy(registered);

		return commands;
	}
}