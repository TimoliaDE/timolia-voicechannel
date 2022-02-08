module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		//Bot gestartet
		console.log("Bot erfolgreich gestartet und eingeloggt als " + client.user.username);

		//Rich Presence
		client.user.setStatus('invisible');
	},
};