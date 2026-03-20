import type {
	ChatInputCommandInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import type { CommandContext } from './CommandContext.js';

export default abstract class Command {
	/** The JSON payload used to register the command with the Discord API. */
	public abstract readonly data:
		RESTPostAPIChatInputApplicationCommandsJSONBody;

	protected deferReply: boolean = true;

	/**
	 * Creates a new Discord slash command.
	 *
	 * @author gitrog
	 *
	 * @param {CommandContext} ctx the command context providing access to the
	 * interaction handlers
	 */
	constructor(protected ctx: CommandContext) {};

	public async execute(interaction: ChatInputCommandInteraction) {
		if (this.deferReply) await interaction.deferReply();
		return await this.run(interaction);
	}

	/**
	 * Executes the instructions specific to the command.
	 *
	 * @author gitrog
	 *
	 * @param {ChatInputCommandInteraction} interaction the Discord chat command
	 * interaction with the command
	 */
	public abstract run(
		interaction: ChatInputCommandInteraction
	): Promise<unknown>;
}