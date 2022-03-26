const Discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
const {Command} = require('advanced-command-handler');
const config = require('../../config')
const alters = require('../../alter')
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

module.exports = new Command({
    name: 'alter',
    description: 'Information sur votre alter ou choisis votre alter',
    // Optionnals :
    usage: 'alter [reroll]',
    category: 'playerInteraction',
    tags: ['guildOnly'],
    aliases: ['myalter'],
    channels: config.channels,
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 3
}, async (client, message, args) => {
    let embed = new Discord.MessageEmbed();
    const memberAlter = message.member.alterProperties;
    const alterChoosers = async () =>{
        embed
            .setTitle(`Quel sera votre alter ?`)
            .setColor(config.color)
            .setTimestamp()
            .setFooter(`discord.gg/oneforall`, message.author.displayAvatarURL({dynamic: true}))
        const msg = await message.channel.send(embed)


        let i = 0;
        let alterChoose;
        let max = getRandomInt(alters.length)

        const alterChooser = setInterval(async () => {
            alterChoose = alters[max];
            i++
            const chooser = new Discord.MessageEmbed()
                .setTitle(`Quel sera votre alter ?`)
                .setColor(config.color)
                .addField('Information:', `Nom: ${alterChoose.name}\n Guide: ${alterChoose.pageGuide}`)
                .addField('Attack:', `${alterChoose.attack.map(attack => `[${attack.name}](${attack.wikiLink}) : ${attack.damage} dégats`).join("\n\n")}`)
                .setImage(alterChoose.attack[0].img)
                .setTimestamp()
                .setFooter(`discord.gg/oneforall`, message.author.displayAvatarURL({dynamic: true}))
            await msg.edit(chooser)
            max = getRandomInt(alters.length)


        }, 1000)
        setTimeout(async () =>{


            clearInterval(alterChooser)
            embed
                .setTitle(`Votre alter est ${alterChoose.name}`)
                .addField('Information:', `**Nom**: ${alterChoose.name}\n **Guide**: ${alterChoose.pageGuide}`)
                .addField('Attack:', `${alterChoose.attack.map(attack => `[${attack.name}](${attack.wikiLink}) : ${attack.damage} dégats`).join("\n\n")}`)
                .setColor(config.color)
                .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setImage(alterChoose.attack[0].img)
                .setTimestamp();
            await msg.delete()
            await message.channel.send(embed)
            message.member.updateAlter = {name: alterChoose.name, id: alterChoose.id};
        }, 5000)

    }
    if(args[0] === "reroll"){
        let inventory = message.member.inventory
        let items = inventory.items;

        const hasObject = items.filter(item => item.id === "alter");
        if(hasObject.length === 0) return message.channel.send(`Vous n'avez pas l'objet **Alter reroll**`);
        inventory["items"] = items.filter(item => item.id !== "alter");
        message.member.updateInventory = inventory;
        return await alterChoosers()
    }
    if (memberAlter && args[0] !== "reroll") {

        embed
            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
            .addField('Information:', `Nom: ${memberAlter.name}\n Guide: ${memberAlter.pageGuide}`)
            .addField('Attack:', `${memberAlter.attack.map(attack => `[${attack.name}](${attack.wikiLink}) : ${attack.damage} dégats`).join("\n\n")}`)
            .setColor(config.color)
            .setImage(memberAlter.attack[0].img)
            .setTimestamp();
        return await message.channel.send(embed);
    }

    await alterChoosers()



})



;
