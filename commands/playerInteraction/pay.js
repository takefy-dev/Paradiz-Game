const Discord = require('discord.js');
require('discord-reply')
const StateManager = require('../../utils/StateManager');
const { Command, Logger } = require('advanced-command-handler');
const config = require('../../config')


module.exports = new Command({
    name: 'pay',
    description: 'Give money to somebody',
    // Optionnals :
    usage: '',
    category: 'interaction',
    tags: ['guildOnly'],
    channels: config.channels,
    cooldown: 2
}, async (client, message, args) => {
    if (isNaN(args[0]) && !message.mentions.members.first()) return message.channel.send(`Vous devez uniquement entrer une id ou une mention en argument`).then(mp => mp.delete({ timeout: 4000 }));
    if (isNaN(args[1])) return message.channel.send(`Vous devez uniquement entrer des nombres de coins à donner`).then(mp => mp.delete({ timeout: 4000 }));
    if (args[1] < 0) return message.channel.send(`Vous devez uniquement entrer des chiffre supérieur a 0`)
    if (args[1].includes('.')) {
        if ((args[1].split('.')[1].split('').length > 2)) return message.channel.send(`Vous devez uniquement entrer des chiffre correct`)
    }


    const member = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
    if (member.user.id === message.author.id) return message.channel.send(`Vous ne pouvez pas vous donner vous même des coins à donner`).then(mp => mp.delete({ timeout: 4000 }))
    let receiverCoins = member.coins
    let giverCoins =  message.member.coins
    if(!giverCoins) return message.channel.send(`Vous n'avez pas de coins`)
    if(giverCoins < args[1]) return message.channel.send(`Vous ne pouvez pas donner ${args[1]} coins`)
    giverCoins -= parseFloat(args[1])
    receiverCoins += parseFloat(args[1])
    try{
        member.updateCoins = receiverCoins
        message.member.updateCoins = giverCoins
        await message.lineReply(`Vous avez donné \`${args[1]}\` coins à ${member}`)
        const logs = message.guild.channels.cache.get(client.config.logs)
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag,message.author.displayAvatarURL({dynamic: true}))
        .setDescription(`${message.member} a donné \`${args[1]}\` coins à ${member.user.tag}`)
        .setTimestamp()
		.setThumbnail(``)
		.setColor(`#2F3136`)
        .setFooter('.gg/oneforall')
        logs.send(embed)
    }catch (e) {
        Logger.error('Pay player coins', 'WARNING ERROR')
        console.log(e)
    }
   
    
});
