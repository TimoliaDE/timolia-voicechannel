module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// little log in the console if the bot is started
		console.log("Bot erfolgreich gestartet und eingeloggt als " + client.user.username);

		// rich presence for invisible bot
		client.user.setStatus('invisible');
	},
};