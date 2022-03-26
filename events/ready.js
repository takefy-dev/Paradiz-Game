const StateManager = require('../utils/StateManager');
const { Event } = require('advanced-command-handler');
const { Logger } = require('advanced-command-handler');
const { DateTime } = require('luxon');
const Player = require('../utils/structures/Player');
const Discord = require('discord.js')
const StartGame = require('../utils/structures/StartGame');
module.exports = new Event(
	{
		name: 'ready',
		once: true,
	},
	async (handler) => {
		/**
	 * Log information of the bot in the console.
	 * @returns {void}
	 */
		function log() {
			Logger.event(`Date : ${Logger.setColor('yellow', DateTime.local().toFormat('TT'))}`);
			Logger.event(`RAM used  : ${Logger.setColor('magenta', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} ` + Logger.setColor('magenta', 'MB'));
		}


		Logger.event(
			Logger.setColor(
				'#c0433f',
				`Client online ! Client ${Logger.setColor('orange', handler.client.user.username, '#c0433f')} has ${handler.client.guilds.cache.size + Logger.setColor('#c0433f')} guilds, it sees ${handler.client.users.cache.size + Logger.setColor('#c0433f')
				} users.`
			)
		);
		const activities = ['Dev by TakeFy & Designed by baby', 'discord.gg/oneforall']
		let i =0
		setInterval(async () =>{
			if(i === 0){
				i++
			}else{
				i--
			}
			await handler.client.user.setActivity(activities[i], { type: 'PLAYING' })

		}, 30000)
		const Game = new StartGame(handler.client);
		await Game.start()
		const guilds = handler.client.guilds.cache.get('911658222014836757');
		const channel = guilds.channels.cache.get('911658222388146201')
		setInterval(async () => {
			const msg = await channel.messages.fetch('911714417127882864')
			const lb = await guilds.getLeaderboard();
			const embed = new Discord.MessageEmbed()
				.setTitle(`<a:coinsoneforall:829804484523589652> Top 10 des membres ayant le plus de coins`)
				.setDescription(lb)
				.setFooter(`discord.gg/oneforall`)
				.setURL(`https://discord.gg/oneforall`)
				.setColor(handler.client.config.color)
			msg.edit(embed)
		}, 60000)
	}
);