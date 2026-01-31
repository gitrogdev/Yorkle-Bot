import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder
} from 'discord.js';
import type Yorkle from '../../../game/Yorkle.js';

export default abstract class Command {
	public abstract readonly data: SlashCommandBuilder;

	constructor(protected game: Yorkle) {};

	/**
	 * Executes the command.
	 *
	 * @param {ChatInputCommandInteraction} interaction the Discord chat command
	 * interaction with the command
	 */
	public abstract execute(
		interaction: ChatInputCommandInteraction
	): Promise<void>;
}