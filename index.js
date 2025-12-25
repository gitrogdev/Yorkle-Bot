const fs = require('node:fs');
const path = require('node:path');
const {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	MessageFlags
} = require ('discord.js');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const ERROR_MESSAGE = {
	content: 'An error occurred while executing this command.',
	flags: MessageFlags.Ephemeral
};

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(
	(file) => file.endsWith('.js')
);

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) client.commands.set(
		command.data.name, command
	); else console.warn(
		`The command "${file}" is missing a required "data" or "execute" `
		+ 'property.'
	);
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`Unknown command "${interaction.commandName}.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred)
			await interaction.followUp(ERROR_MESSAGE);
		else await interaction.reply(ERROR_MESSAGE);
	}
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Initialized client as @${readyClient.user.tag}.`);
});

client.login(DISCORD_TOKEN);