import {
	REST,
	Routes,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';

import type Command from '../models/Command.js';
import type CommandRegistry from '../models/CommandRegistry.js';
import pluralize from '../../../util/pluralize.js';
import NewGameCommand from '../commands/NewGameCommand.js';
import type GameInteractionHandler from
	'./interactions/MetaInteractionHandler.js';
import GuessCommand from '../commands/GuessCommand.js';
import SkipCommand from '../commands/SkipCommand.js';
import ShareCommand from '../commands/ShareCommand.js';
import SetGameChannelCommand from '../commands/SetGameChannelCommand.js';
import WhenNextCommand from '../commands/WhenNextCommand.js';
import RandomLyricCommand from '../commands/RandomLyricCommand.js';
import GameContentCommand from '../commands/GameContentCommand.js';
import JudgementCommand from '../commands/JudgementCommand.js';
import GetVersionCommand from '../commands/GetVersion.js';
import GetSupportCommand from '../commands/GetSupportCommand.js';
import GetLocaleInfoCommand from '../commands/GetLocaleInfoCommand.js';
import HintCommand from '../commands/HintCommand.js';
import type { CommandContext } from '../models/CommandContext.js';

type CommandFactory = (ctx: CommandContext) => Command;

export default class CommandRegistrar {
	/** Factory methods to build each command by context. */
	private static readonly COMMAND_FACTORIES: CommandFactory[] = [
		// Content commands
		ctx => new GameContentCommand(ctx),
		ctx => new JudgementCommand(ctx),
		ctx => new RandomLyricCommand(ctx),

		// Guild commands
		ctx => new SetGameChannelCommand(ctx),

		// Metadata commands
		ctx => new GetLocaleInfoCommand(ctx),
		ctx => new GetSupportCommand(ctx),
		ctx => new GetVersionCommand(ctx),
		ctx => new WhenNextCommand(ctx),

		// Session commands
		ctx => new GuessCommand(ctx),
		ctx => new HintCommand(ctx),
		ctx => new NewGameCommand(ctx),
		ctx => new SkipCommand(ctx),

		// User data commands
		ctx => new ShareCommand(ctx)
	];

	/** Discord REST client used to perform API requests. */
	private readonly rest: REST;

	/**
	 * Creates a new command registrar.
	 *
	 * @author gitrog
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
	 * @author gitrog
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
	 * @author gitrog
	 *
	 * @param {CommandContext} ctx the CommandContext providing all handlers
	 *
	 * @returns {CommandRegistry} an object containing the built commands
	 */
	public register(ctx: CommandContext): CommandRegistry {
		const commands: CommandRegistry = {};
		const registered = [];
		for (const factory of CommandRegistrar.COMMAND_FACTORIES) {
			const command = factory(ctx);
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