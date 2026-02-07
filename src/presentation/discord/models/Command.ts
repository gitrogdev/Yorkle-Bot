import type {
	ChatInputCommandInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import type GameInteractionHandler from '../services/GameInteractionHandler.js';

export default abstract class Command {
	/** The JSON payload used to register the command with the Discord API. */
	public abstract readonly data:
		RESTPostAPIChatInputApplicationCommandsJSONBody;

	/**
	 * Creates a new Discord slash command.
	 *
	 * @author gitrog
	 *
	 * @param {GameInteractionHandler} handler the handler class for
	 * interactions with the game through commands
	 */
	constructor(protected handler: GameInteractionHandler) {};

	/**
	 * Executes the command.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the Discord chat command
	 * interaction with the command
	 */
	public abstract execute(
		interaction: ChatInputCommandInteraction
	): Promise<void>;
}