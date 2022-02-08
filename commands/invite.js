const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { guildId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Lade eine Person zu dir in den Channel ein')
        .addUserOption(option => option.setName('person').setDescription('Wähle eine Person welche du zu deinem Channel hinzufügen möchtest')),
    async execute(interaction, client) {

        const fehler = new MessageEmbed()
            .setTitle(`${client.user.username} • Invite`)
            .setDescription(`Du musst in deinem Privaten Channel sein um Personen hinzufügen zu können!`)
            .setColor("DARK_RED")
            .setTimestamp()

        const user = interaction.options.getUser('person'); // Getting invited User
        const guild = client.guilds.cache.get(guildId); // Getting the guild
        const member = guild.members.cache.get(interaction.user.id); // Getting the member

        if (member.voice.channel) {
            const channel = member.voice.channel;
            if (channel.name !== "Channel von " + member.user.username) return interaction.reply({ephemeral: true, embeds: [fehler]});
            await channel.permissionOverwrites.edit(user, {
                CONNECT: true,
                VIEW_CHANNEL: true,
            })
        } else {
            interaction.reply({ephemeral: true, embeds: [fehler]});
        }

        const embed = new MessageEmbed()
            .setTitle(`${client.user.username} • Invite`)
            .setDescription(`<@` + user.id + `> wurde zu deinem Channel hinzugefügt`)
            .setTimestamp()
            .setColor("GREEN")
        interaction.reply({ephemeral: true, embeds: [embed]});

        const welcome = new MessageEmbed()
            .setTitle(`${client.user.username} • Invite`)
            .setDescription(`Du wurdest zum Channel von Channel von  ` + member.user.username + ` hinzugefügt und kannst dich nun mit diesem Verbinden`)
            .setTimestamp()
            .setColor("GREEN")
        user.send({ephemeral: true, embeds: [welcome]})
    },
};