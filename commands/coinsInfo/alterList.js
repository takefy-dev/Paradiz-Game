const Discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
const {Command} = require('advanced-command-handler');
const config = require('../../config')
const alters = require('../../alter')
module.exports = new Command({
    name: 'alter-list',
    description: 'Show alter list',
    // Optionnals :
    usage: '!alter',
    category: 'userInfo',
    tags: ['guildOnly'],
    aliases: ['alters'],
    channels: config.channels,
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 2
}, async(client, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Liste de tout les alters`)
            .setDescription(alters.map((alter, i) => `\`${i+1}\` ${alter.name}\n`))
            .setColor(config.color)
            .setTimestamp()
			.setThumbnail(`https://media.discordapp.net/attachments/710541021175349300/833971101494804490/image-removebg-preview.png`)
            .setURL(`https://www.discord.com/oneforall`)
            .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
        await message.channel.send(embed)

});
