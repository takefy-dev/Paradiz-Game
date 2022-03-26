const StateManager = require('../StateManager');
const { Logger } = require('advanced-command-handler');
const config = require('../../config')
class Player {

    static async createPlayer(user, guildId) {
        try {
            const coins = 0
            await StateManager.connection.query(`INSERT INTO coins (userId, coins, guildId) VALUES ('${user.id}', '0', '${guildId}')`).then(() => {
                Logger.log(`${Logger.setColor('red')} ${user.tag}`, 'new player coins')
            })
            /**
             * @example  {name: "bread', quantity: 1}, armor: {helmet: {type: , durability}}
             * 
             */
            const inventory = []
            
            await StateManager.connection.query(`INSERT INTO inventory (userId, guildId) VALUES ('${user.id}', '${guildId}')`).then(() => {
                Logger.log(`${Logger.setColor('red')} ${user.tag}`, 'new player inventory')
            })
            const player = [{health: 100, food: 100}]
            await StateManager.connection.query(`INSERT INTO player (userId, guildId) VALUES ('${user.id}', '${guildId}')`).then(() => {
                Logger.log(`${Logger.setColor('red')} ${user.tag}`, 'new player')
            })
            return coins
        } catch (e) {
            Logger.error('Create player error', 'WARNING')
            console.log(e)
            return null
        }


    }

    static async updateCoins(playerId, guildId, coins) {
        try {
            await StateManager.connection.query(`UPDATE coins SET coins = '${coins}'  WHERE userId = '${playerId}' AND guildId = '${guildId}'`)
            return coins;
        } catch (e) {
            Logger.error('Update player coins', 'WARNING')
            return null
        }
    }

    static async getCoins(playerId, guildId) {
        const playerCoins = await StateManager.connection.query(`SELECT coins FROM coins WHERE userId = '${playerId}' AND guildId = '${guildId}'`)
        if (playerCoins[0][0] === undefined) return undefined;
        return playerCoins[0][0].coins
    }
    static async getLeaderboards(guildId) {
        let lb;
        await StateManager.connection.query(`SELECT * FROM coins WHERE guildId = '${guildId}'`).then((res) => {
            lb = Object.entries(res[0]).sort((a, b) => b[1].coins - a[1].coins)
        })
        let i = 0

        return lb.filter(user =>

            user[1].userId !== "188356697482330122" && user[1].userId !== "828807218849251338"

        ).slice(0, 10).map((user, i) => i + 1 === 1 ? ` ${i + 1} . <@${user[1].userId}>: ${user[1].coins} coins` : i + 1 === 2 ? ` ${i + 1} . <@${user[1].userId}>: ${user[1].coins} coins` : i + 1 === 3 ? ` ${i + 1} . <@${user[1].userId}>: ${user[1].coins} coins` : `${i + 1} . <@${user[1].userId}>: ${user[1].coins} coins`)

    }
    static async getInventory(playerId, guildId){
        const inventory = await StateManager.connection.query(`SELECT inventory FROM inventory WHERE userId = '${playerId}' AND guildId = '${guildId}'`)
        if(inventory[0][0] === undefined) return undefined;
        return JSON.parse(inventory[0][0].inventory)
    }
    static async getPlayer(playerId, guildId){
        const player = await StateManager.connection.query(`SELECT information FROM player WHERE userId = '${playerId}' AND guildId = '${guildId}'`)
        if(player[0][0] === undefined) return undefined;
        return JSON.parse(player[0][0].information)
    }
    static async editPlayerProperties(playerId, guildId, health, food){
        const properties = await this.getPlayer(playerId, guildId)
        if(health){
            properties[0].health = health;
        }else{
            console.log(food)

            properties[0].food = food;
        }
        try{
            await StateManager.connection.query(`UPDATE player SET information = ?`, [JSON.stringify(properties)])
            return properties
        }catch (e) {
            Logger.error('Update player stats', 'WARNING')
            console.log(e)
        }
      
    }
    static async updateInventory(playerId, guildId, inventory){
        try{
            await StateManager.connection.query(`UPDATE inventory SET inventory = ?`, [JSON.stringify(inventory)])
            return inventory
        }catch (e) {
            console.log(e)
        }
    }
    static async updateAlter(playerId, guildId, alter){
        let inventory = await this.getInventory(playerId, guildId);
        inventory[0].alter[0].name = alter.name;
        inventory[0].alter[0].type = alter.type;
        inventory[0].alter[0].id = alter.id;
        inventory = await this.updateInventory(playerId, guildId, inventory);
        return inventory;
    }

}


module.exports = Player;