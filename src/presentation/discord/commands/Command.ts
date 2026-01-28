import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder
} from 'discord.js';

export default abstract class Command {
	public abstract readonly data: SlashCommandBuilder;

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