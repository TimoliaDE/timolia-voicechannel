const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { guildId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Lade eine Person zu dir in den Channel ein')
        .addUserOption(option => option.setName('person').setDescription('Wähle eine Person welche du zu deinem Channel hinzufügen möchtest')),
    async execute(interaction, client) {

        // embed for if not in own channel
        const errorEmbed = new MessageEmbed()
            .setTitle(`${client.user.username} • Invite`)
            .setDescription(`Du musst in deinem Privaten Channel sein um Personen hinzufügen zu können!`)
            .setColor("DARK_RED")
            .setTimestamp()

        // global useful constants
        const user = interaction.options.getUser('person'); // Getting invited User
        const guild = client.guilds.cache.get(guildId); // Getting the guild
        const member = guild.members.cache.get(interaction.user.id); // Getting the member

        // check if user is voice channel
        if (member.voice.channel) {
            const channel = member.voice.channel;
            // if not in own channel
            if (channel.name !== "Channel von " + member.user.username) return interaction.reply({ephemeral: true, embeds: [errorEmbed]});
            //grant perms for invited user
            await channel.permissionOverwrites.edit(user, {
                CONNECT: true,
                VIEW_CHANNEL: true,
            })
        } else {
            // send error embed
            interaction.reply({ephemeral: true, embeds: [errorEmbed]});
        }

        // success embed for command
        const embed = new MessageEmbed()
            .setTitle(`${client.user.username} • Invite`)
            .setDescription(`<@` + user.id + `> wurde zu deinem Channel hinzugefügt`)
            .setColor("GREEN")
            .setTimestamp()

        // embed for invited player
        const welcome = new MessageEmbed()
            .setTitle(`${client.user.username} • Invite`)
            .setDescription(`Du wurdest zum Channel von Channel von  ` + member.user.username + ` hinzugefügt!`)
            .setColor("GREEN")
            .setTimestamp()

        // error user cant be added to channel
        const notAUser = new MessageEmbed()
            .setTitle(`${client.user.username} • Invite`)
            .setDescription(`<@` + user.id + `> konnte nicht hinzugefügt werden weil er ein Bot ist!`)
            .setColor("DARK_RED")
            .setTimestamp()

        // check if the user is a bot
        if (user.bot === true || user.system === true) return interaction.reply({ephemeral: true, embeds: [notAUser]});

        // send success embed
        interaction.reply({ephemeral: true, embeds: [embed]});

        // send user dm with info that he got added
        user.send({ephemeral: true, embeds: [welcome]})
    },
};