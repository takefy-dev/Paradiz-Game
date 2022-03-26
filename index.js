const { Collection } = require('discord.js');
const config = require('./config')
const {CommandHandler} = require('advanced-command-handler');
require('./utils/structures/Member')
require('./utils/structures/Guild')

CommandHandler
.create({
	eventsDir: 'events',
	commandsDir: 'commands',
	prefixes: [config.prefix],
	owners: ['828807218849251338', '188356697482330122', '781497617468358677', "659038301331783680"]
})
.launch({
	token: config.token,
});
CommandHandler.client.farmingCoins = new Collection();
CommandHandler.client.config = config;