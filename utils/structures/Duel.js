const Discord = require("discord.js");
const config = require('../../config')
const emojis = ['✔', '❌'];

module.exports = class Duel {
    constructor(duelist, message, type, coins) {
        this.duelist = duelist;
        this.message = message;
        this.miseCoins = coins;
        this.fightChannel = null;
        this.type = type;
    }

    async sendDm() {
        const duelerMember = this.message.member;
        const duelerAuthor = this.message.author;
        await this.message.channel.send(`${duelerMember}, ${this.duelist} regardez vos dm`)

        let duelAccept = {
            player1: false,
            player2: false
        }
        const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === duelerAuthor.id || emojis.includes(reaction.emoji.name) && user.id === this.duelist.id;
        const duelistEmbed = new Discord.MessageEmbed()
            .setTitle(`Nouveau duel`)
            .setDescription(`${duelerAuthor.tag} vous propose un duel de type ${this.type} ${!this.miseCoins ? '': `(${this.miseCoins})coins`}.
                    Voulez-vous accepter ?
                `)
            .setTimestamp()
            .setFooter(`discord.gg/oneforall`, duelerAuthor.displayAvatarURL({dynamic: true}))
            .setColor(config.color)
        const duelistMsg = await this.duelist.user.send(duelistEmbed).then(async m => {
            for await (const emoji of emojis) {
                await m.react(emoji)
            }
            const collector = m.createReactionCollector(filter, {time: 120000});
            collector.on('collect', async r => {
                if (r.emoji.name === emojis[0]) {
                    collector.stop('accept')


                    await m.channel.send(`Duel accepté`).then(() => {
                        duelerAuthor.send(`${this.duelist.user.tag} a accepté le duel`)
                        duelAccept.player2 = true
                        this.duel(duelAccept)

                    })

                } else {
                    collector.stop('declined')

                    await m.channel.send(`Duel refusé`).then(() => {
                        duelerAuthor.send(`${this.duelist.user.tag} a refusé le duel`)

                    })

                }

            })
            collector.on(`end`, (_, reason) =>{
                if(reason === "time"){
                    duelAccept.player2 = false;
                }
            })
        });
        const duelerEmbed = new Discord.MessageEmbed()
            .setTitle(`Nouveau duel`)
            .setDescription(`Vous avez proposé un duel de type ${this.type}  à ${this.duelist.user.tag} ${!this.miseCoins ? '': `avec ${this.miseCoins} misé`}`)
            .setTimestamp()
            .setFooter(`discord.gg/oneforall`, duelerAuthor.displayAvatarURL({dynamic: true}))
            .setColor(config.color)
        const duelerMsg = await duelerAuthor.send(duelerEmbed).then(async m => {
            for await (const emoji of emojis) {
                await m.react(emoji)
            }
            const collector = m.createReactionCollector(filter, {time: 120000});
            collector.on('collect', async r => {
                if (r.emoji.name === emojis[0]) {
                    collector.stop('accept')

                    await m.channel.send(`Duel accepté`).then(() => {
                        this.duelist.user.send(`${duelerAuthor.tag} a accepté le duel`)
                        duelAccept.player1 = true
                        this.duel(duelAccept)

                    })

                } else {
                    collector.stop('declined')
                    await m.channel.send(`Duel refusé`).then(() => {
                        this.duelist.user.send(`${duelerAuthor.tag} a refusé le duel`)

                    })

                }

            })
            collector.on(`end`, (_, reason) =>{
                if(reason === "time"){
                    duelAccept.player1 = false;
                }
            })
        });


    }

    async duel(duelConfirmation) {
        if (duelConfirmation.player1 && duelConfirmation.player2) {
            const cooldown = {
                40: 10,
                20: 5,
                10: 3
            }
            const filter = (message) => this.message.author.id === message.author.id || message.author.id === this.duelist.id
            const attackMap = new Map();
            await this.message.guild.channels.create(`${this.message.author.username} VS ${this.duelist.user.username}`,{
                type: 'text',
                parent: this.message.channel.parent,
                reason : `New duel`,
                rateLimitPerUser : 3,
            }).then(async channel => {
                this.fightChannel = channel
                await this.message.author.send(`<#${channel.id}>`)
                this.duelist.user.send(`<#${channel.id}>`)
                await channel.overwritePermissions([
                    {
                        id: config.duelRole,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: config.coinsRole,
                        deny: ['SEND_MESSAGES'],
                        allow : ['VIEW_CHANNEL']
                    },
                    {
                        id: this.message.guild.roles.everyone.id,
                        deny: ['VIEW_CHANNEL']
                    }
                ])
                await this.message.member.roles.add(config.duelRole)
                this.duelist.roles.add(config.duelRole)

                if(this.type === "coins"){
                    channel.send(`Un duel de coins est organisé pour une une mise de ${this.miseCoins} coins`)
                }

            })
            // if(this.type === "coins"){
            //     await this.message.channel.updateOverwrite(config.coinsRole, {
            //         SEND_MESSAGES: false
            //     }, 'Duel coins').then(() => {
            //         this.message.member.roles.add(config.duelRole)
            //         this.duelist.roles.add(config.duelRole)
            //
            //     })
            // }
            if(!this.fightChannel) return;
            const collector = this.fightChannel.createMessageCollector(filter, {time: 300000})
            const player1Alter = this.message.member.alterProperties
            const player2Alter = this.duelist.alterProperties
            const fight = new Discord.MessageEmbed()
                .setTimestamp()
                .setAuthor(`${this.message.author.tag} VS ${this.duelist.user.tag}`)
                .addField(`${this.message.author.tag}:`, `**Nom de l'alter**: ${player1Alter.name}\n**Attaques**:\n${player1Alter.attack.map((attack, i) => `${i + 1} . [${attack.name}](${attack.wikiLink}):\n Cooldown: ${cooldown[attack.damage]}s\n${attack.damage} dégats`).join('\n')}`)
                .addField(`${this.duelist.user.tag}:`, `**Nom de l'alter**: ${player2Alter.name}\n**Attaques**:\n${player2Alter.attack.map((attack, i) => `${i + 1} . [${attack.name}](${attack.wikiLink}):\nCooldown: ${cooldown[attack.damage]}s\n ${attack.damage} dégats`).join('\n')}`)
                .setImage("https://media.giphy.com/media/3on29QZskqV4ezNx9L/giphy.gif")
                .setColor(config.color)
            await this.fightChannel.send(fight)
            const healthEmbed = new Discord.MessageEmbed()
                .setAuthor(`${this.message.author.tag} VS ${this.duelist.user.tag}`)
                .addField(`${this.message.author.tag}:`, `${this.message.member.health}/100`)
                .addField(`${this.duelist.user.tag}:`, `${this.duelist.health}/100`)
                .setTimestamp()
                .setColor(config.color);

            const healthMsg = await this.fightChannel.send(healthEmbed)
            let editMsg = setInterval(() => {
                if(this.fightChannel.deleted) return clearInterval(editMsg)
                const newHealth = new Discord.MessageEmbed()
                    .setAuthor(`${this.message.author.tag} VS ${this.duelist.user.tag}`)
                    .addField(`${this.message.author.tag}:`, `${!this.message.member.health ? 0 : this.message.member.health}/100`)
                    .addField(`${this.duelist.user.tag}:`, `${!this.duelist.health ? 0 : this.duelist.health}/100`)
                    .setTimestamp()
                    .setColor(config.color);
                if(healthMsg){
                    healthMsg.edit(newHealth)

                }
            }, 5000)
            collector.on(`collect`, async m => {
                const attackChoose = m.content;
                if (isNaN(attackChoose)) return await m.delete();
                if (attackMap.has(m.author.id)) return m.reply(`Patientez ${attackMap.get(m.author.id).cd}s avant d'attaquer`)
                if (attackChoose > 3) return;
                const attack = m.member.alterProperties.attack[attackChoose - 1];
                const damage = attack.damage;
                let receiver = m.author.id !== this.duelist.id ? this.duelist : this.message.member;
                let receiverHealth = receiver.health;
                receiverHealth -= damage;
                receiver.updateHealth = receiverHealth
                const embed = new Discord.MessageEmbed()
                    .setAuthor(m.author.tag, m.author.displayAvatarURL({dynamic: true}))
                    .setColor(config.color)
                    .setTimestamp()
                    .setImage(attack.img)
                    .setDescription(`**Attaque**: [${attack.name}](${attack.wikiLink})\n**Dégats**: ${damage}\n**Vie de ${receiver.user.tag}**: ${!receiverHealth ? 0 : receiverHealth}/100`)
                await m.channel.send(embed)

                if (receiverHealth <= 0) {
                    collector.stop("finish")
                }
                attackMap.set(m.author.id, {
                    id: attackChoose - 1,
                    damage,
                    cd: cooldown[damage]
                })
                setTimeout(() => {
                    attackMap.delete(m.author.id)
                }, attackMap.get(m.author.id).cd * 1000)
            })

            collector.on("end", async (collected, reason) => {
                setTimeout(() =>{
                    if(this.fightChannel) this.fightChannel.delete('Duel end')
                }, 10000)
                let player1Health = this.message.member.health;
                let player2Health = this.duelist.health;
                if (reason === "time") {
                    await this.fightChannel.send(`Temps écoulé`)

                }
                if (player1Health > player2Health) {
                    if (player2Health <= 0) this.duelist.updateHealth = 100
                    if (this.type === "coins") {
                        this.message.member.updateCoins = parseInt(this.message.member.coins + this.miseCoins)
                        this.duelist.updateCoins = parseInt(this.duelist.coins - this.miseCoins)
                    }
                    if(this.fightChannel){
                        await this.fightChannel.send(`${this.message.member} remporte le duel ${!this.miseCoins ? '' : `il gagne ${this.miseCoins} coins`}`)

                    }
                } else if (player1Health < player2Health) {
                    if (player1Health <= 0) this.message.member.updateHealth = 100
                    if (this.type === "coins") {
                        this.message.member.updateCoins = parseInt(this.message.member.coins - this.miseCoins);
                        this.duelist.updateCoins = parseInt(this.duelist.coins + this.miseCoins)
                    }
                    if(this.fightChannel){
                        await this.message.member.roles.remove(config.duelRole)
                        await this.duelist.roles.remove(config.duelRole)
                        await this.fightChannel.send(`${this.duelist} remporte le duel ${!this.miseCoins ? '' : `il gagne ${this.miseCoins} coins`}`)

                    }

                } else {
                    if(this.type === "coins"){
                        this.duelist.updateCoins = this.duelist.coins - this.miseCoins
                        this.message.member.updateCoins = this.message.member.coins - this.miseCoins
                    }

                    if (this.fightChannel) {
                        await this.message.channel.send(`Aucun gagnant les 2 duelistes ont perdu ${this.miseCoins} coins`)
                        await this.message.member.roles.remove(config.duelRole)
                        await this.duelist.roles.remove(config.duelRole)


                    }
                }
                attackMap.clear()



            })


        }


    }

    async start() {
        await this.sendDm()
    }
}
