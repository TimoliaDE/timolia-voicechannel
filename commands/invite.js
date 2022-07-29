const { SlashCommandBuilder, EmbedBuilder, Colors} = require('discord.js');
const { guildId } = require('../config.json');
const {PermissionFlagsBits} = require("discord-api-types/v10");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Lade eine Person zu dir in den Channel ein')
        .addUserOption(option => option.setName('person').setDescription('Wähle eine Person, welche du in deinen Channel einladen möchtest').setRequired(true)),
    async execute(interaction, client) {

        // embed for if not in own channel
        const errorEmbed = new EmbedBuilder()
            .setTitle(`${client.user.username} • Invite`)
            .setDescription(`Du musst in deinem privaten Channel sein um Personen einladen zu können!`)
            .setColor(Colors.DarkRed)
            .setTimestamp()

        // global useful constants
        const user = interaction.options.getUser('person'); // Getting invited User
        const guild = client.guilds.cache.get(guildId); // Getting the guild
        const member = guild.members.cache.get(interaction.user.id); // Getting the member

        // check if user is voice channel
        if (member.voice.channel) {
            const channel = member.voice.channel;
            // if not in own channel
            if (channel.name !== "Channel von " + member.nickname) return interaction.reply({ephemeral: true, embeds: [errorEmbed]});
            //grant perms for invited user
            await channel.permissionOverwrites.set([{
                id: user.id,
                deny: [PermissionFlagsBits.Connect],
            }])
        } else {
            // send error embed
            interaction.reply({ephemeral: true, embeds: [errorEmbed]});
        }

        // success embed for command
        const embed = new EmbedBuilder()
            .setTitle(`${client.user.username} • Invite`)
            .setDescription(`<@` + user.id + `> wurde in deinen Channel eingeladen!`)
            .setColor(Colors.Green)
            .setTimestamp()

        // embed for invited player
        const welcome = new EmbedBuilder()
            .setTitle(`${client.user.username} • Invite`)
            .setDescription(`Du wurdest in den Channel von  ` + member.nickname + ` eingeladen!`)
            .setColor(Colors.Green)
            .setTimestamp()

        // error user cant be added to channel
        const notAUser = new EmbedBuilder()
            .setTitle(`${client.user.username} • Invite`)
            .setDescription(`<@` + user.id + `> konnte nicht eingeladen werden, da er ein Bot ist!`)
            .setColor(Colors.DarkRed)
            .setTimestamp()

        // check if the user is a bot
        if (user.bot === true || user.system === true) return interaction.reply({ephemeral: true, embeds: [notAUser]});

        // send success embed
        interaction.reply({ephemeral: true, embeds: [embed]});

        // send user dm with info that he got added
        user.send({ephemeral: true, embeds: [welcome]}).catch(() => console.log(user.username + " hat Direktnachrichten deaktiviert!"))
    },
};