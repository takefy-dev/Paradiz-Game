const Discord = require('discord.js');
const guildId = '911658222014836757';
const { Logger } = require('advanced-command-handler')
const config = require('../../config')
const vilains = require('../../vilain');
const Vilains = require('./Vilain');
const { Collection } = require('discord.js')
const setRandomInterval = require("set-random-interval");
const booster = {
    "stream": 2,
    "default": 1,
    "mute": 0.5
}
let loadedVoice = 0;
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}
const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
class Game{
    constructor(client) {
        this.client = client;
    }



    async loadVoice(){
        this.client.guilds.cache.forEach(guild =>{
            let status = "default";

            const members = guild.members.cache.filter(message => !message.bot && message.voice.channelID != null);
            for (const [, member] of members) {

                if(member.voice.mute === true && member.voice.deaf === false){
                    status = "mute";
                }
                else if(member.voice.streaming === true){
                    status = "stream"
                }
                if(this.client.farmingCoins.has(member.id)) return;
                this.client.farmingCoins.set(member.id, {
                    status,
                    boost : booster[status]
                })
                loadedVoice++
            }
        })
        Logger.log(`${loadedVoice}`, `Loaded voice`, 'white')
        // setInterval(() =>{
        //     console.log(this.client.farmingCoins)
        //
        // }, 1000)
    }

    async farming (ms){

        setInterval(async () =>{
            const guild = this.client.guilds.cache.get(guildId);
            for await(const [id, status] of this.client.farmingCoins){
                let member = guild.members.cache.get(id);
                if(member.register){
                    let coins = member.coins;
                    member.updateCoins = coins + status.boost;
                }

            }
        }, ms)

    }

    async food (ms){
        setInterval(async () =>{
            
            const guild = this.client.guilds.cache.get(guildId);
            for await(const [id,] of this.client.farmingCoins){
                let member = guild.members.cache.get(id);
                if(!member.register) return;
                let food = member.food;
                if(food > 0){
                    member.updateFood = food -1;
                }else{
                    let health = member.health;
                    member.updateHealth = health - 1
                }
            }
        }, ms)
    }

    async spawnVilain(){


        const cooldown = {
            40: 10,
            20: 5,
            10: 3
        }
        let alreadySpawn = false;
        let fighters = new Collection();
        let attackMap = new Collection();
        const channels = config.spawnerChannel;
        const maxDelay = 3.6e+6;
        const minDelay = 5 * 60000;
        const spawner = setRandomInterval.default(async () =>{
            if(alreadySpawn) {
                return;
            }else{
                alreadySpawn = true;
            }

            const vilainId = getRandomInt(vilains.length);
            const randomCoins = randomInt(200, 2000);
            const guild = this.client.guilds.cache.get(config.guildID)
            const channel = guild.channels.cache.get(channels[getRandomInt(channels.length)]);
            const filter = (message) => !message.author.bot && message.member.alterProperties

            const collector = channel.createMessageCollector(filter, {time: randomInt(60000, 5*60000)})

            const Vilain = new Vilains(vilains[vilainId]);
            Logger.log(`Spawning a vilain ${Vilain.name}`, `SPAWNING`, "pink");

            const embed = new Discord.MessageEmbed()
                .setColor(config.color)
                .setTitle(`Un vilain vient d'apparaître dans ${channel.name}`)
                .addField(`Nom:`, Vilain.name)
                .addField(`Vie:`, `${Vilain.health}/${Vilain.totalHealth}`)
                .addField(`Attaques:`, Vilain.attack.map(attack => `[${attack.name}](${attack.wikiLink}): ${!attack.damage ? `Régénération ${attack.regen}`: `Dégats ${attack.damage}`}\n`))
                .setImage(Vilain.img)
            await channel.send(embed)
            await channel.send(`<@&${config.coinsRole}> attaquez le si vous remportez le combat vous gagnerez des coins`);
            const vilainAttack = setRandomInterval.default(async() =>{
                if(fighters.size === 0) return;
                Logger.log(`Start attacking`, `VILAIN ATTACK`, 'red')

                const randomAttack = Vilain.attack[getRandomInt(Vilain.attack.length)];
                const attackEmbed = new Discord.MessageEmbed()
                    .setAuthor(`${Vilain.name} attaque avec ${randomAttack.name}`)
                    .setColor(config.color)
                    .setTimestamp()
                    .setImage(randomAttack.img)
                    .setDescription(`**Attaque**: [${randomAttack.name}](${randomAttack.wikiLink})\n${!randomAttack.damage ? `**Régénération:** ${randomAttack.regen}`: `**Dégats:** ${randomAttack.damage}`}\n**`)
                await channel.send(attackEmbed)
                if(randomAttack.regen){
                    await channel.send(`${Vilain.name} regénère ces points de vie de ${randomAttack.regen}`);
                    let newVilainHealth = Vilain.health + randomAttack.regen;
                    if(newVilainHealth > Vilain.totalHealth){
                        newVilainHealth = Vilain.totalHealth;
                    }
                    return Vilain.updateHealth = newVilainHealth
                }
                for (const [id, health] of fighters){
                    let member = guild.members.cache.get(id);
                    const damage = !randomAttack.damage ? 0 : randomAttack.damage;
                    member.updateHealth =  member.health - damage;

                    fighters.set(id, member.health);
                }

                const newMembersHealth = new Discord.MessageEmbed()
                    .setTitle(`Vie de tous les héros`)
                    .setDescription(fighters.map((health, id) => `**${this.client.users.cache.get(id).username}:**   ${health}/100\n`))
                    .setColor(config.color)
                    .setTimestamp()
                    .setFooter('discord.gg/oneforall')
                channel.send(newMembersHealth)
                if(fighters.filter(health => health > 0).size === 0) return collector.stop('fighters_dead')

            }, 6000, 2*60000)
            collector.on('collect', async (message) =>{
                const attackChoose = message.content;
                if(isNaN(attackChoose)) return message.delete();
                if(!fighters.has(message.author.id)) fighters.set(message.author.id, message.member.health);
                if(fighters.get(message.author.id) <= 0) return message.delete();
                if (attackMap.has(message.author.id)) return message.reply(`Patientez ${attackMap.get(message.author.id).cd}s avant d'attaquer`)
                if (attackChoose > 3) return;
                const attack = message.member.alterProperties.attack[attackChoose - 1];
                const damage = attack.damage;



                attackMap.set(message.author.id, {
                    id: attackChoose - 1,
                    damage,
                    cd: cooldown[damage]
                })
                setTimeout(() => {
                    attackMap.delete(message.author.id)
                }, attackMap.get(message.author.id).cd * 1000);

                if(Vilain.health > 0){
                    Vilain.updateHealth = Vilain.health - damage;
                }else{
                    collector.stop('dead')
                }
                const attackEmbed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                    .setColor(config.color)
                    .setTimestamp()
                    .setImage(attack.img)
                    .setDescription(`**Attaque**: [${attack.name}](${attack.wikiLink})\n**Dégats**: ${damage}\n**Vie de ${Vilain.name}**: ${!Vilain.health ? 0 : Vilain.health}/${Vilain.totalHealth}`)
                await message.channel.send(attackEmbed)
            })
            collector.on('end', (_, reason) =>{
                if(reason === "dead"){
                    channel.send(`${Vilain.name} a été vaincu vous remportez tous ${randomCoins}`);
                    const memberAlive = fighters.filter(health => health > 0)
                    const memberNotAlive = fighters.filter(health => health <= 0)
                    for(const [id, health] of memberAlive){
                        const member = guild.members.cache.get(id);
                        member.updateCoins = member.coins + randomCoins
                    }
                    for(const [id, health] of memberNotAlive){
                        const member = guild.members.cache.get(id);
                        member.updateHealth = 100
                    }

                }else if(reason === "fighters_dead"){
                    channel.send(`${Vilain.name} vous a tous tué, vous gagnez aucun coins`);
                    for(const [id,_] of fighters){
                        const member = guild.members.cache.get(id);
                        member.updateHealth = 100;
                    }
                }else{
                    channel.send(`${Vilain.name} s'est échapé vous gagnez ${randomCoins/2}`)
                    const memberAlive = fighters.filter(health => health > 0)
                    const memberNotAlive = fighters.filter(health => health <= 0)
                    for(const [id, health] of memberAlive){
                        const member = guild.members.cache.get(id);
                        member.updateCoins = member.coins + randomCoins/2
                    }
                    for(const [id, health] of memberNotAlive){
                        const member = guild.members.cache.get(id);
                        member.updateHealth = 100
                    }
                }
                alreadySpawn = false;
                return vilainAttack.clear()
            })

        }, minDelay, maxDelay)
    }


    async start(){
        await this.loadVoice()
        await this.farming(60000)
        await this.food(900000)
        await this.spawnVilain()
    }
}

module.exports = Game;