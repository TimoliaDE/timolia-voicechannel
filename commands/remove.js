const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { guildId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Entferne eine Person aus deinem Channel')
        .addUserOption(option => option.setName('person').setDescription('Wähle eine Person, welche du aus deinem Channel entfernen möchtest').setRequired(true)),
    async execute(interaction, client) {

        // embed for if not in own channel
        const errorEmbed = new MessageEmbed()
            .setTitle(`${client.user.username} • Remove`)
            .setDescription(`Du musst in deinem Privaten Channel sein um Personen entfernen zu können!`)
            .setColor("DARK_RED")
            .setTimestamp()

        // global useful constants
        const user = interaction.options.getUser('person'); // Getting removed User
        const guild = client.guilds.cache.get(guildId); // Getting the guild
        const member = guild.members.cache.get(interaction.user.id); // Getting the member
        const removedMember = guild.members.cache.get(user.id); // Getting the member

        // check if user is voice channel
        if (member.voice.channel) {
            const channel = member.voice.channel;
            // if not in own channel
            if (channel.name !== "Channel von " + member.user.username) return interaction.reply({ephemeral: true, embeds: [errorEmbed]});
            //remove perms for removed user
            await channel.permissionOverwrites.edit(user, {
                CONNECT: false,
                //VIEW_CHANNEL: true, <- you should see all channels
            })
            await removedMember.voice.setChannel(null);
        } else {
            // send error embed
            interaction.reply({ephemeral: true, embeds: [errorEmbed]});
        }

        // success embed for command
        const embed = new MessageEmbed()
            .setTitle(`${client.user.username} • Remove`)
            .setDescription(`<@` + user.id + `> wurde aus deinem Channel entfernt!`)
            .setColor("GREEN")
            .setTimestamp()

        // embed for invited player
        const welcome = new MessageEmbed()
            .setTitle(`${client.user.username} • Remove`)
            .setDescription(`Du wurdest aus dem Channel von  ` + member.user.username + ` entfernt!`)
            .setColor("GREEN")
            .setTimestamp()

        // error user cant be added to channel
        const notAUser = new MessageEmbed()
            .setTitle(`${client.user.username} • Remove`)
            .setDescription(`<@` + user.id + `> konnte nicht entfernt werden, da er ein Bot ist!`)
            .setColor("DARK_RED")
            .setTimestamp()

        // check if the user is a bot
        if (user.bot === true || user.system === true) return interaction.reply({ephemeral: true, embeds: [notAUser]});

        // send success embed
        interaction.reply({ephemeral: true, embeds: [embed]});

        // send user dm with info that he got added
        user.send({ephemeral: true, embeds: [welcome]}).catch(() => console.log(user.username + " hat Direktnachrichten deaktiviert!"))
    },
};