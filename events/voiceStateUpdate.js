const { createChannel, existingChannel,privateChannel } = require('../config.json');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
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
                    newState.member.voice.setChannel(channel)
                    //console.log(channel)
                    channel.permissionOverwrites.edit(newState.member.user, {
                        MANAGE_CHANNELS: true
                    })
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