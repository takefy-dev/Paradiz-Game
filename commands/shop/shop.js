const Discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
const {Command} = require('advanced-command-handler');
const config = require('../../config')
const shop = require('../../shop');
module.exports = new Command({
    name: 'shop',
    description: 'Shop',
    // Optionnals :
    usage: '.shop',
    category: 'shop',
    tags: ['guildOnly'],
    aliases: ['magasin'],
    channels: config.channels,
    cooldown: 3
}, async(client, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setTitle(`ParadizShop`)
            .setDescription(shop.map((item, i) => `\`${i+1}\` **${!item.role ? item.name : message.guild.roles.cache.get(item.id).name}** — ⏣ ${item.price.toLocaleString()} coins\n`))
            .setColor(config.color)
            .setTimestamp()
            .setFooter(`discord.gg/oneforall`, message.author.displayAvatarURL({dynamic: true}))
        await message.channel.send(embed)

});
