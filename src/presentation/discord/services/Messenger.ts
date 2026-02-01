import type {
	ChatInputCommandInteraction,
	InteractionEditReplyOptions,
	InteractionReplyOptions,
	MessageCreateOptions,
	MessagePayload,
	User
} from 'discord.js';

type EditOptions = string | MessagePayload | InteractionEditReplyOptions;
type MessageOptions = string | MessagePayload | MessageCreateOptions;
type ReplyOptions = string | MessagePayload | InteractionReplyOptions;

export default class Messenger {
	/**
	 * Safely send a direct message to a user.
	 *
	 * @param {User} user the user to send a direct message to
	 * @param {MessageOptions} options the options for the payload
	 * containing the message's contents to send to Discord
	 */
	public async dm(user: User, options: MessageOptions) {
		try {
			return await user.send(options);
		} catch (exception) {
			console.warn(
				`Failed to send a direct message to ${user.username}: `,
				exception
			);
		}
	}

	/**
	 * Safely reply to an interaction.
	 *
	 * @param {ChatInputCommandInteraction} interaction the interaction to
	 * reply to
	 * @param {ReplyPayload | EditPayload} options the options for the payload
	 * containing the reply's contents to send to Discord
	 */
	public async reply(
		interaction: ChatInputCommandInteraction,
		options: ReplyOptions | EditOptions
	) {
		try {
			if (interaction.deferred || interaction.replied)
				return await interaction.editReply(options as EditOptions);
			else return await interaction.reply(options as ReplyOptions);
		} catch (exception) {
			console.warn('Failed to reply to interaction: ', exception);
			return null;
		}
	}
}