const Discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
const {Command} = require('advanced-command-handler');
const config = require('../../config')


module.exports = new Command({
    name: 'inventory',
    description: 'Show inventory',
    category: 'userInfo',
    tags: ['guildOnly'],
    aliases: ['inv', 'bag'],
    channels: config.channels,
    cooldown: 3
}, async(client, message, args) => {
    const inventory = await message.member.inventory;
    // const inventory = [{items: [{name: 'bread', quantity: 1}, {name: 'sword', quantity:1}], armor: [{name: 'Casque' ,type: 'diamond', health: 100, id: 'helmet'}, {name: 'Plastron',type: 'diamond', health: 100, id:'chest'},{id:'jambe', name: 'Jambière',type: 'diamond', health: 100}, {id: 'boots',name: 'Bottes',type: 'diamond', health: 100}]}]
    if(!inventory) return message.channel.send(`Vous n'avez pas de charactère veuillez rejoindre un salon vocal pour commencer à jouer`)
    let alter = message.member.alterProperties ||message.member.alter;
    const embed = new Discord.MessageEmbed()
        .addField(`Objets :`, `\n ${inventory.items.length < 1 ? `Aucun objets`: `\`\`\`${inventory.items.map(item => ` ${item.name} x${item.quantity}`)}\`\`\``}`)
        .addField(`Alter :`, `\n ${alter.id === "none" ? `Aucun alter`: `\`\`\`${alter.name}\`\`\``}`)
        .addField(`Nourriture :`, `\n \`${message.member.food}/100\``)
        .addField(`Vie :`, `\n \`${message.member.health}/100\``)
        .setColor(config.color)
        .setFooter(message.author.tag,message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()
    await message.channel.send(embed)

});
