module.exports = {
    name: 'guildMemberAdd',
    execute(member) {
        member.roles.add([
            '842069823696535582', //Spezial Ränge
            '842060394520772709', //Spielmodi
            '842068215105978429', //4rena Custom Ranks
            '717739834713702472', //4rena
            '842058723862380575' //Camper
        ]);
    },
};