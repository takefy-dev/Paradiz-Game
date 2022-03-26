const Discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
const {Command} = require('advanced-command-handler');
const config = require('../../config')
const Player = require('../../utils/structures/Player');
require('discord-reply')

module.exports = new Command({
    name: 'feed',
    description: 'Feed',
    category: 'interaction',
    tags: ['guildOnly'],
    aliases: ['manger', 'nourrire'],
    channels: config.channels,
    cooldown: 4
}, async (client, message, args) => {

    const foodOfUser = message.member.food;
    const healthOfUser = message.member.health;
    const playerInventory = message.member.inventory
    const items = playerInventory.items;

    if (items.length < 1) return message.lineReply(`Vous avez aucun objets veuillez en acheter dans le magasin`);
    const foodItems = items.filter(item => item.type === "food");
    if (!foodItems) return message.lineReply(`Vous avez aucune nourriture dans votre inventaire`)
    if (foodOfUser >= 100 && healthOfUser >= 100) {
        return message.lineReply(`Vous êtes déjà à \`100/100\` de nourriture et vie`)
    }
    const reactionEm = {
        'bread': '🍞',
        "meet": '🥩',
        "apple": '🍎',
        "coconuts": '🥥'
    }
    const foodProperties = config.food;
    const msg = await message.channel.send(`Chargement ...`)
    const embed = new Discord.MessageEmbed()
        .setTitle(`Quel est la nourriture à utilisé`)
        .setDescription(foodItems.map(item => `${item.name}: +${foodProperties[item.id].food} points de nourriture & +\`${foodProperties[item.id].health}\` points de vie , x\`${item.quantity}\`\n`).join(''))
        .setFooter('discord.gg/oneforall', message.author.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        .setColor(config.color)
    const emoji = [];
    foodItems.forEach(food => {
        let foodEmoji = reactionEm[food.id];
        emoji.push(foodEmoji)

    })
    emoji.push('❌')
    const filter = (reaction, user) => emoji.includes(reaction.emoji.name) && user.id === message.author.id;
    for await (const em of emoji) await msg.react(em)
    msg.edit('', embed).then(async m => {
        const collector = m.createReactionCollector(filter, {time: 900000});
        collector.on('collect', async r => {
            await r.users.remove(message.author);
            if (r.emoji.name === '❌') {
                await msg.delete();
                collector.stop();
                return message.channel.send(`Rassasion annulé`)
            }
            const foodChoose = getKeyByValue(reactionEm, r.emoji.name)
            if(foodOfUser < 100){
                const numberToFeed = foodProperties[foodChoose].food;
                let finalFoodBar = parseInt(numberToFeed + foodOfUser);

                if (finalFoodBar >= 100) {
                    const toMuch = finalFoodBar - 100;
                    finalFoodBar = numberToFeed + toMuch;
                }
                message.member.updateFood = finalFoodBar;

            }
            if(healthOfUser < 100){
                const numberToHealth = foodProperties[foodChoose].health;
                let finalHealthBar = parseInt(numberToHealth + healthOfUser);
                if(finalHealthBar >= 100){
                    finalHealthBar = 100;
                }
                message.member.updateHealth = finalHealthBar;

            }
            playerInventory.items.filter(item => item.id === foodChoose)[0].quantity = foodItems.filter(food => food.id === foodChoose)[0].quantity - 1;
            if (playerInventory.items.filter(item => item.id === foodChoose)[0].quantity < 1) {
                playerInventory.items = playerInventory.items.filter(item => item.id !== foodChoose)
            }


            message.member.updateInventory = playerInventory
            await message.lineReply(`Vous êtes maintenant rassasié (\`${message.member.food}/100 et ${message.member.health}/100 de vie\`) `)
            collector.stop()
            return msg.delete();

        })
    })

});

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}