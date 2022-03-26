const Discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
const {Command} = require('advanced-command-handler');


module.exports = new Command({
    name: 'setfood',
    description: 'Set food of somebody',

    category: 'owner',
    tags: ['ownerOnly'],
    cooldown: 4
}, async(client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.channel.send(`Vous devez spécifier une membre`)
    if(isNaN(args[1])) return message.channel.send(`Uniqement des nombres en args 2`)
    const food = parseInt(args[1])
    member.updateFood = food;
    await message.channel.send(`Vous avez définie le nombre de bouffe de ${member} à  ${food}`)



    

});
