module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		// rich presence for invisible bot
		client.user.setStatus('invisible');
	},
};