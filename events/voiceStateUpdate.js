const { createChannel, existingChannel,privateChannel, guildId, everyoneId } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        // if new channel is not null & new channel is in parent of createChannel
        if (newState.channel !== null && newState.channel.parent.id === createChannel) {

            // global constants
            const channelName = newState.channel.name;
            const joined = !!newState.channelId
            const channelId = joined ? newState.channelId : oldState.channelId
            let channel = newState.guild.channels.cache.get(channelId)

            // const of schematic channel
            const {
                type,
                userLimit,
                bitrate,
                edit,
                rawPosition,
            } = channel

            // check for private channel
            if (newState.channel.id === privateChannel) {
                //create private channel
                newState.guild.channels.create("Channel von " + newState.member.user.username, {
                    type,
                    bitrate,
                    userLimit,
                    parent: existingChannel,
                    edit,
                    position: rawPosition,
                }).then((channel) => {
                    // move person in the channel
                    newState.member.voice.setChannel(channel)

                    const guild = client.guilds.cache.get(guildId); // Getting the guild
                    const role = guild.roles.cache.get(everyoneId); // Getting the member

                    // remove perm of @everyone to join and see the channel
                    channel.permissionOverwrites.edit(role, {
                        CONNECT: false,
                        VIEW_CHANNEL: false,
                    })

                    //  welcomeEmbed for person who creates the channel
                    const welcomeEmbed = new MessageEmbed()
                        .setTitle("Hey " + newState.member.user.username)
                        .setDescription(
                            "Es wurde ein Channel für dich erstellt und du hast die Berechtigungen erhalten diesen zu bearbeiten! \n" +
                            "Jetzt kannnst du auf das Zahnrad auf dem Channel klicken und Einstellungen vornehmen, zum Beispiel kannst du den Channel Privat schalten" +
                            " und nur dir und deinen Freunden zugriff auf diesen erteilen."
                        )
                        .setTimestamp();

                    // send person who creates the channel welcome embed
                    newState.member.user.send({ephemeral: true, embeds: [welcomeEmbed]});
                })
                return;
            }

            // its not a private channel so just copy the channel
            newState.guild.channels.create(channelName, {
                type,
                bitrate,
                userLimit,
                parent: existingChannel,
                edit,
                position: rawPosition,
            }).then((channel) => {
                // and move the user in the new channel
                newState.member.voice.setChannel(channel)
            })
        }

        // if the channel is empty, NOT null and in the existingChannel parent delete it
        if (oldState.channel !== null && oldState.channel.members.size === 0 && oldState.channel.parent.id === existingChannel) return oldState.channel.delete();
    },
};