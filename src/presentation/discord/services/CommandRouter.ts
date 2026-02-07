import {
	MessageFlags,
	type Interaction,
	type InteractionReplyOptions
} from 'discord.js';

import type CommandRegistry from '../models/CommandRegistry.js';

export default class CommandRouter {
	/** The default error message to send when a command fails to execute. */
	private static readonly ERROR_MESSAGE: InteractionReplyOptions = {
		content: 'An error occurred while executing this command.',
		flags: MessageFlags.Ephemeral
	};

	/**
	 * Creates a new object to route Discord slash command interactions to their
	 * associated command objects.
	 *
	 * @author gitrog
	 *
	 * @param {CommandRegistry} commands the registry containing the commands to
	 * route interactions to
	 */
	constructor(private readonly commands: CommandRegistry) {}

	/**
	 * Routes an interaction to a command's execution.
	 *
	 * @author gitrog
	 *
	 * @param {Interaction} interaction the interaction to bind to the command
	 */
	public async route(interaction: Interaction): Promise<void> {
		if (!interaction.isChatInputCommand()) return;

		const command = this.commands[interaction.commandName];
		if (!command) {
			console.error(`Unknown command "${interaction.commandName}"!`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred)
				await interaction.followUp(CommandRouter.ERROR_MESSAGE);
			else await interaction.reply(CommandRouter.ERROR_MESSAGE);
		}
	}
}