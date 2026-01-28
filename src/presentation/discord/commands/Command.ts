import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder
} from 'discord.js';

export default abstract class Command {
	public abstract readonly data: SlashCommandBuilder;
	public abstract execute(
		interaction: ChatInputCommandInteraction
	): Promise<void>;
}