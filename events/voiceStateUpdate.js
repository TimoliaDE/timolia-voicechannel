const { createChannel, existingChannel,privateChannel, guildId, everyoneId } = require('../config.json');
const { EmbedBuilder } = require('discord.js');
const { PermissionFlagsBits } = require("discord-api-types/v10");

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

            // const of preset channel
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
                newState.guild.channels.create({
                    name: "Channel von " + newState.member.nickname,
                    type,
                    bitrate,
                    userLimit,
                    parent: existingChannel,
                    edit,
                    position: rawPosition,
                    permissionOverwrites: [{
                        // deny to rate limit = user cant join channel for 20 sec
                        id: newState.member.user.id,
                        deny: [PermissionFlagsBits.Connect],
                    }]
                }).then((channel) => {
                    // clear perms to allow joining again
                    setTimeout(() => parent.permissionOverwrites.delete(newState.member.user.id), 20000) // <- this is ms

                    // grant user access to own private channel
                    channel.permissionOverwrites.set([{
                        id: newState.member.user.id,
                        allow: [PermissionFlagsBits.Connect],
                    }])

                    // move person in the channel
                    newState.member.voice.setChannel(channel)

                    // remove perm of @everyone to join and see the channel
                    channel.permissionOverwrites.set([{
                        id: everyoneId,
                        deny: [PermissionFlagsBits.Connect],
                    }])

                    //  welcomeEmbed for person who creates the channel
                    const welcomeEmbed = new EmbedBuilder()
                        .setTitle("Hey " + newState.member.nickname)
                        .setDescription(
                            "Es wurde ein privater Channel für dich erstellt! \n" +
                            "Du kannst nun Personen in deinen Channel einladen in dem du diese einlädst. \n" +
                            "Füge Personen mit folgendem Befehl zu deinem Channel hinzu: \`\`\` /invite USER\`\`\`" +
                            "Entferne Personen aus deinem Channel mit folgendem Befehl: \`\`\`/remove USER\`\`\`" +
                            "**Bitte beachte, dass diese Commands nur auf dem Server ausgeführt werden können:bangbang:**"
                        )
                        .setTimestamp();

                    // send person who creates the channel welcome embed
                    newState.member.user.send({embeds: [welcomeEmbed]})
                        //catch if user has disabled dms
                        .catch(() => console.log(newState.member.nickname + " hat Direktnachrichten deaktiviert!"));
                })
                return;
            }

            // it is not a private channel so just copy the channel
            newState.guild.channels.create({
                name: channelName,
                type,
                bitrate,
                userLimit,
                parent: existingChannel,
                edit,
                position: rawPosition,
            }).then((channel) => {
                // rate limit = user cant join channel for 10 sec
                newState.channel.parent.permissionOverwrites.set([{
                    // rate limit = user cant join channel for 10 sec
                    id: newState.member.user.id,
                    deny: [PermissionFlagsBits.Connect],
                }]).then((parent) => {
                    setTimeout(() => parent.permissionOverwrites.delete(newState.member.user.id), 10000) // <- this is ms
                })

                // and move the user in the new channel
                newState.member.voice.setChannel(channel)
            })
        }

        // if the channel is empty, NOT null and in the existingChannel parent delete it
        if (oldState.channel !== null && oldState.channel.members.size === 0 && oldState.channel.parent.id === existingChannel) return oldState.channel.delete();
    },
};