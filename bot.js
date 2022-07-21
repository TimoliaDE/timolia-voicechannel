const fs = require('fs');
const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder} = require('discord.js');
const { InteractionType } = require("discord-api-types/v10");
const { token } = require('./config.json');

//Intents
const myIntents = []
myIntents.push(GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages);

//Partials
const myPartials = [];
myPartials.push(Partials.Message, Partials.GuildMember, Partials.Channel);

const client = new Client({ intents: myIntents, partials: myPartials });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

//Command Handler
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//Event Handler
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.rest.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.rest.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.on('interactionCreate', async interaction => {
	if (interaction.type !== InteractionType.ApplicationCommand) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		const errorEmbed = new EmbedBuilder()
			.setTitle(`${client.user.username} • Fehler`)
			.setTimestamp(interaction.createdAt)
			.setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
			.setDescription(`Es ist ein Fehler aufgetreten, bitte wende dich an <@398101340322136075>!`)
			.setColor("#ff0000");
		return interaction.reply({ephemeral: true, embeds: [errorEmbed]});
	}
});

client.login(token);