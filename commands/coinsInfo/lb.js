const Discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
const { Command } = require('advanced-command-handler');

const config = require('../../config')

module.exports = new Command({
    name: 'leaderboard',
    aliases: ['lb'],
    channels: config.channels,

    cooldown: 2
}, async (client, message, args) => {
    const lb = await message.guild.getLeaderboard();
    const embed = new Discord.MessageEmbed()
        .setTitle(`Top 10 des membres ayant le plus de coins`)
        .setDescription(lb)
	    .setThumbnail(`https://media.discordapp.net/attachments/710541021175349300/833992135908130826/image-removebg-preview_1.png`)
        .setFooter(`discord.gg/oneforall`)
        .setColor(config.color)
    await message.channel.send(embed)
});


