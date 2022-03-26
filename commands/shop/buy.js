const Discord = require('discord.js')
const StateManager = require('../../utils/StateManager');
const {Command, Logger} = require('advanced-command-handler');
const config = require('../../config')
const shop = require('../../shop')
let hexColorRegex = require('hex-color-regex');
module.exports = new Command({
    name: 'buy',
    description: 'Acheter dans le shop',
    // Optionnals :
    usage: '*buy <id>',
    category: 'shop',
    tags: ['guildOnly'],
    aliases: ['acheter'],
    channels: config.channels,
    clientPermissions: ['EMBED_LINKS'],
    cooldown: 4
}, async (client, message, args) => {
    function hexColorCheck(a) {
        let check = hexColorRegex().test(a);
        let checkVerify = false;
        if (check === true) {
            checkVerify = true;
        }
        return checkVerify;
    }

    let toBuy = args[0];
    const maxShop = shop.length;
    if (isNaN(toBuy) || !toBuy || toBuy > maxShop) return message.channel.send(`Vous devez entrer des uniquement des nombres inférieur \`${maxShop - 1}\``);
    toBuy = shop[parseInt(args[0] - 1)];
    let buyerCoins = message.member.coins
    if (buyerCoins < toBuy.price) return message.channel.send(`Vous n'avez pas assé de coins`)
    if (toBuy.inGame) {
        let inventory = message.member.inventory;
        let items = inventory.items;
        let hasItem = items.filter(item => item.id === toBuy.id);
        if (hasItem.length !== 0) {
            hasItem[0].quantity = hasItem[0].quantity + 1;
        } else {
            items.push({name: toBuy.name, quantity: 1, id: toBuy.id, type: toBuy.type})

        }
        buyerCoins -= toBuy.price;
        message.member.updateCoins = buyerCoins;
        message.member.updateInventory = inventory
        await message.channel.send(`Vous avez acheté **${toBuy.name}** pour \`${toBuy.price}\` coins`).then(() => {
            Logger.log(`${message.author.tag} buy \`${toBuy.name}\``, `New item buyed`)
        })
    } else if (toBuy.role) {
        const role = message.guild.roles.cache.get(toBuy.id);
        if (message.member.roles.cache.has(role.id)) return message.channel.send(`Vous avez déjà ce role`);
        await message.member.roles.add(role);
        buyerCoins -= toBuy.price;
        message.member.updateCoins = buyerCoins;
        await message.channel.send(`Vous avez acheté **${toBuy.name}** pour \`${toBuy.price}\` coins`).then(() => {
            Logger.log(`${message.author.tag} buy \`${toBuy.name}\``, `New item buyed`)
        })
    } else if (toBuy.id === "perso") {
        let nameOfRole;
        let color;
        const dureefiltrer = response => {
            return response.author.id === message.author.id
        };
        message.channel.send(`🛐 Quel est la nom du grade perso ?`).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, {max: 1, time: 30000, errors: ['time']})
                .then(async cld => {
                    let msg = cld.first();
                    nameOfRole = msg.content;
                    await message.channel.send(`Le nom du grade perso est ${nameOfRole}`)
                    await message.channel.send(`🎨 Quel est la couleur du role ? [HTML COLOR CLIC POUR LE LIEN](https://htmlcolorcodes.com/fr/)`).then((mps) => {
                        mp.channel.awaitMessages(dureefiltrer, {
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        }).then(async collected => {
                            let msg = collected.first()
                            let checkColor = hexColorCheck(msg.content);
                            if (!checkColor || !msg.content) return message.channel.send(`La couleur est incorrect (#DBC03F)`)
                            color = msg.content;
                        })
                    })
                });
        });
        if(nameOfRole && color){
            await message.guild.roles.create({
                data: {
                    name: nameOfRole,
                    color: color
                },
                reason: `Grade perso: ${message.member.user.tag}`
            }).then((rl) => {
                message.member.roles.add(rl);
                buyerCoins -= toBuy.price;
                message.member.updateCoins = buyerCoins;
                message.channel.send(`Vous avez acheté **${rl.name}** pour \`${toBuy.price}\` coins`).then(() => {
                    Logger.log(`${message.author.tag} buy \`${rl.name}\``, `New item buyed`)
                })
            })
        }

    }


});
