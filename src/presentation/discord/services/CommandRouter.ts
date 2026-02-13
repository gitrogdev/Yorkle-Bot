import {
	MessageFlags,
	type Interaction,
	type InteractionReplyOptions
} from 'discord.js';

import type CommandRegistry from '../models/CommandRegistry.js';
import { localize } from '../../localization/i18n.js';

export default class CommandRouter {
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

			const errorMessage: InteractionReplyOptions = {
				content: localize('errors.commandgeneric', interaction.locale),
				flags: MessageFlags.Ephemeral
			}

			if (interaction.replied || interaction.deferred)
				await interaction.followUp(errorMessage);
			else await interaction.reply(errorMessage);
		}
	}
}