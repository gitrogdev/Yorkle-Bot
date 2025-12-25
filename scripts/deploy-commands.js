const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const APPLICATION_ID = process.env.APPLICATION_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const commands = [];
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(
	(file) => file.endsWith('.js')
);
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) commands.push(
		command.data.toJSON()
	);
	else console.warn(
		`The command "${file}" is missing a required "data" or "execute" `
		+ 'property.'
	);
}

const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
	try {
		console.log(
			`Deploying ${commands.length} `
			+ `command${commands.length == 1 ? '' : 's'}...`
		);

		const data = await rest.put(
			Routes.applicationCommands(APPLICATION_ID),
			{ body: commands }
		);

		console.log(
			`Successfully deployed ${data.length} `
			+ `command${data.length == 1 ? '' : 's'}!`
		);
	} catch (error) {
		console.error(error);
	}
})();