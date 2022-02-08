const { createChannel, existingChannel,privateChannel, guildId, everyoneId } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        if (newState.channel !== null && newState.channel.parent.id === createChannel) {

            const channelName = newState.channel.name;
            const joined = !!newState.channelId
            const channelId = joined ? newState.channelId : oldState.channelId
            let channel = newState.guild.channels.cache.get(channelId)

            const {
                type,
                userLimit,
                bitrate,
                edit,
                rawPosition,
            } = channel

            if (newState.channel.id === privateChannel) {
                newState.guild.channels.create("Channel von " + newState.member.user.username, {
                    type,
                    bitrate,
                    userLimit,
                    parent: existingChannel,
                    edit,
                    position: rawPosition,
                }).then((channel) => {
                    //Verschiebe Person in Channel
                    newState.member.voice.setChannel(channel)

                    //Gebe Person Permissions in dem Channel
                    channel.permissionOverwrites.edit(newState.member.user, {
                        CONNECT: true,
                    })

                    const guild = client.guilds.cache.get(guildId); // Getting the guild
                    const role = guild.roles.cache.get(everyoneId); // Getting the member

                    channel.permissionOverwrites.edit(role, {
                        CONNECT: false,
                        VIEW_CHANNEL: false,
                    })

                    //Schicke Person Direktnachricht mit Infos
                    const embed = new MessageEmbed()
                        .setTitle("Hey " + newState.member.user.username)
                        .setDescription(
                            "Es wurde ein Channel für dich erstellt und du hast die Berechtigungen erhalten diesen zu bearbeiten! \n" +
                            "Jetzt kannnst du auf das Zahnrad auf dem Channel klicken und Einstellungen vornehmen, zum Beispiel kannst du den Channel Privat schalten" +
                            " und nur dir und deinen Freunden zugriff auf diesen erteilen."
                        )
                        .setTimestamp();
                    newState.member.user.send({ephemeral: true, embeds: [embed]});
                })
                return;
            }

            newState.guild.channels.create(channelName, {
                type,
                bitrate,
                userLimit,
                parent: existingChannel,
                edit,
                position: rawPosition,
            }).then((channel) => {
                newState.member.voice.setChannel(channel)
            })
        }
        if (oldState.channel !== null && oldState.channel.members.size === 0 && oldState.channel.parent.id === existingChannel) return oldState.channel.delete();
    },
};