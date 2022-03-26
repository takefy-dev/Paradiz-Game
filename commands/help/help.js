const Discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
const {Command, CommandHandler} = require('advanced-command-handler');
const config = require('../../config')

module.exports = new Command({
    name: 'help',
    description: 'Show the help',
    // Optionnals :
    usage: '!help',
    category: 'help',
    tags: ['guildOnly'],
    aliases: ['h'],
    channels: config.channels,
    cooldown: 4
}, async(handler, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setTitle('Aide sur les commandes')
		.addField(`**Informations**`, `\`coins\`, \`inventory\`, \`help\`, \`leaderboard\`, \`alter-list\``)
		.addField(`**Alter**`, `\`duel\`, \`alter\`, \`feed\``)
		.addField(`**Shop**`, `\`shop\`, \`pay\`, \`buy\``)
		.addField(`**Owner**`, `\`setcoins\`, \`setfood\`, \`sethealth\``)
     //   .setDescription(CommandHandler.commands.map(command => `**${command.name}**:\nDescription: \`${command.description}\`\nUsage: \`${command.usage}\`\nAliases: \`${!command.aliases ? 'Aucun aliases' : command.aliases}\`\n`))
        .setTimestamp()
		.setImage(`https://media.discordapp.net/attachments/710541021175349300/834024327292387338/paradizgame.png`)
        .setColor(config.color)
        .setFooter('discord.gg/oneforall', message.author.displayAvatarURL({dynamic: true}))

    await message.channel.send(embed)

});
