import {
	InteractionContextType,
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
	type RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import Command from '../models/Command.js';

export default class HelloCommand extends Command {
	public readonly data: RESTPostAPIChatInputApplicationCommandsJSONBody =
		new SlashCommandBuilder()
			.setName('hello')
			.setDescription('hi thm')
			.setContexts(
				InteractionContextType.Guild,
				InteractionContextType.BotDM
			).toJSON();

	public async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply(`
			'aaaonnnooohhoonnnnoohhoonnoohho (kidaee kidaee kidaee baba) '
			+ 'aoohnnoohooonnhhnooaaohoonnhhoohooaoohoonooo(kidaee kidaee '
			+ 'kidaee baba)'
		`).catch((err) => {
			console.error(`Failed to respond to /hello interaction: ${err}`);
		});
	}
}