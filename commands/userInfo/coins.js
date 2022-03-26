
const Discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
const {Command} = require('advanced-command-handler');
const config = require('../../config')

module.exports = new Command({
    name: 'coins',
    description: 'Show member money',
    category: 'userInfo',
    tags: ['guildOnly'],
    aliases: ['balance', 'money', 'argent'],
    channels: config.channels,
    cooldown: 3
}, async(client, message, args) => {

    let member = message.mentions.members.first()  || await message.guild.members.fetch(args[0])
    if(!args[0]) member = message.member;
    if(!member) return await messsage.channel.send(`Vous devrez entrer un membre en arguments`).then(mp => mp.delete({timeout: 4000}))
    let userCoins = member.coins;
    const embed = new Discord.MessageEmbed()
        .setAuthor(`Coins de \`${member.user.tag}\``, member.user.displayAvatarURL({dynamic: true}))
        .setDescription(` \`!${userCoins ? `Aucun`: userCoins.toLocaleString()}\` coins`)
        .setColor('#2F3136')
        .setFooter(`discord.gg/oneforall`)
    await message.channel.send(embed)
});
