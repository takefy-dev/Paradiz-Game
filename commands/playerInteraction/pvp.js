const Discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
const {Command} = require('advanced-command-handler');
const config = require('../../config')
const Duel = require('../../utils/structures/Duel')
const typeOfDuel = ['coins', 'amical']
module.exports = new Command({
    name: 'duel',
    description: 'duel somebody',
    // Optionnals :
    usage: 'duel <@mention/id> <coins/amical> [coins]',
    category: 'interaction',

    tags: ['guildOnly'],
    aliases: ['pvp'],
    channels: config.duelChannels,
    cooldown: 4
}, async(client, message, args) => {
        const dueler = message.member;
        if (isNaN(args[0]) && !message.mentions.members.first()) return message.channel.send(`Vous devez uniquement entrer une id ou une mention en argument`).then(mp => mp.delete({ timeout: 4000 }));
        const toDuel = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        if (toDuel.user.id === message.author.id) return message.channel.send(`Vous ne pouvez pas vous duel vous même`).then(mp => mp.delete({ timeout: 4000 }))
        const type = args[1];
        if(toDuel.alter.id === "none") return message.channel.send(`${toDuel} n'a pas d'alter`)
        if(message.member.alter.id === "none") return message.channel.send(`${message.member} n'a pas d'alter`)
        if(!typeOfDuel.includes(type)) return message.channel.send(`Le type de duel souhaité n'est pas dans les types valide (${typeOfDuel.join(" ")})`)
        if(isNaN(args[2]) && args[2] < 1) return message.channel.send(`Veuillez spécifier une nombre à miser valide`)
        if(type === "coins" && !args[2]) return message.channel.send(`Vous devez entrer une somme à miser`)
        if(args[2] > dueler.coins) return message.channel.send(`Vous n'avez pas asser de coins`)
        if(args[2] > toDuel.coins) return  message.channel.send(`${toDuel} n'a pas asser de coins`)
        const duel = await new Duel(toDuel, message, type, !args[2] ? null : parseInt(args[2])).start();


});
