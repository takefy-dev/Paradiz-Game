const { Structures } = require('discord.js')
const { Logger } = require('advanced-command-handler');
const StateManager = require('../../utils/StateManager');
const alter = require('../../alter');
let fetch = false;
Structures.extend('GuildMember', (Member) => {
    class CustomMember extends Member {
        constructor(client, data, guild){
            super(client,data,guild)
            this.user = data.user;
            if(this.user.bot) return;
            this.register = false;

            this.guildId = guild.id;
            if(this.guildId !== "911658222388146201") return

            this.coins = 0;
            this.inventory = {items: [{name: "Pain", quantity: 5, id:'bread', type:'food'}]};
            this.stats = {health: 100, food: 100};
            this.alter = {name: 'none', id:'none'}
            this.fetchAll();




        }

        set updateCoins(editedCoins){
            if(!this.register) this.newPlayer()

            StateManager.connection.query(`UPDATE coins SET coins = '${editedCoins}' WHERE userId = '${this.user.id}' AND guildId = '${this.guildId}'`).then((res) =>{
                this.coins = editedCoins;
            })
        }

        get health(){
            return this.stats.health;
        }

        get food(){
            return this.stats.food;
        }

        get alterProperties(){
            return alter[this.alter.id];
        }

        set updateHealth(health){
            if(!this.register) this.newPlayer()

            const newStats = this.stats;
            newStats.health = health;
            StateManager.connection.query(`UPDATE player SET information = ? WHERE userId = '${this.user.id}' AND guildId = '${this.guildId}'`, [JSON.stringify(newStats)]).then(() =>{
                this.stats.health = health;
            })
        }

        set updateFood(food){
            if(!this.register) this.newPlayer()

            let newStats = this.stats;
            newStats.food = food;
            StateManager.connection.query(`UPDATE player SET information = ? WHERE userId = '${this.user.id}' AND guildId = '${this.guildId}'`, [JSON.stringify(newStats)]).then(() =>{
                this.stats.food = food;
            })
        }

        set updateAlter(alterProperty){

            StateManager.connection.query(`UPDATE alters SET alterInformation = ? WHERE userId = '${this.user.id}' AND guildId = '${this.guildId}'`, [JSON.stringify(alterProperty)]).then(() =>{
                this.alter = alterProperty;
            })
        }

        set updateInventory(newInventory){
            if(!this.register) this.newPlayer()


            StateManager.connection.query(`UPDATE inventory SET inventory = ? WHERE userId = '${this.user.id}' AND guildId = '${this.guildId}'`, [JSON.stringify(newInventory)]).then(() =>{
                this.inventory = newInventory;
            })

        }

        async saveAll (){
            await StateManager.connection.query(`UPDATE coins SET coins = '${this.coins}' WHERE guildId = '${this.guildId}' AND userId = '${this.user.id}'`)
            await StateManager.connection.query(`UPDATE inventory SET inventory = ?  WHERE guildId = '${this.guildId}' AND userId = '${this.user.id}'`, [JSON.stringify(this.inventory)])
            await StateManager.connection.query(`UPDATE player SET information = ? WHERE guildId = '${this.guildId}'AND userId = '${this.user.id}'`, [JSON.stringify(this.stats)])
            await StateManager.connection.query(`UPDATE alter SET alterInformation = ?  WHERE guildId = '${this.guildId}'AND userId = '${this.user.id}'`, [JSON.stringify(this.alter)])
        }

        async fetchAll(){
            let count = 0
            
            await StateManager.connection.query(`SELECT alterInformation FROM alters WHERE guildId = '${this.guildId}' AND userId = '${this.user.id}'`).then((res) =>{

                if(res[0][0]){
                    this.alter = JSON.parse(res[0][0].alterInformation);
                    count++
                }
            })
            await StateManager.connection.query(`SELECT information FROM player WHERE guildId = '${this.guildId}' AND userId = '${this.user.id}'`).then((res) =>{
                if(res[0][0]){
                    this.stats = JSON.parse(res[0][0].information);
                    count++

                }
            })
            await StateManager.connection.query(`SELECT inventory FROM inventory WHERE guildId = '${this.guildId}' AND userId = '${this.user.id}'`).then((res) =>{
                if(res[0][0]){
                    this.inventory = JSON.parse(res[0][0].inventory);
                    count++
                }
            })
            await StateManager.connection.query(`SELECT coins FROM coins WHERE guildId = '${this.guildId}' AND userId = '${this.user.id}'`).then((res) =>{
                if(res[0][0]){
                    this.coins = res[0][0].coins
                    count++
                }
            })
            if (count < 4 && !this.register) {
                await this.newPlayer()
            }else{
                this.register = true
            }
            Logger.log(`${this.user.username}, ${this.user.id}`, `Fetched`, 'white')
        }


        async newPlayer(){
            if(!this.register){

                StateManager.connection.query(`INSERT INTO inventory VALUES ('${this.user.id}', '${this.guildId}', ?)`, [JSON.stringify(this.inventory)])
                StateManager.connection.query(`INSERT INTO coins VALUES ('${this.user.id}', '${this.guildId}', '${this.coins}')`)
                StateManager.connection.query(`INSERT INTO player VALUES ('${this.user.id}','${this.guildId}', ?)`, [JSON.stringify(this.stats)])
                StateManager.connection.query(`INSERT INTO alters VALUES ('${this.user.id}','${this.guildId}', ?)`, [JSON.stringify(this.alter)]).then((res )=>{
                    Logger.log(`${this.user.id}`, `Player created`, 'red')

                })
                this.register = true;

            }

        }


    }
    return CustomMember
})