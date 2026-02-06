import type {
	ChatInputCommandInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import type GameInteractionHandler from '../services/GameInteractionHandler.js';

export default abstract class Command {
	public abstract readonly data:
		RESTPostAPIChatInputApplicationCommandsJSONBody;

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