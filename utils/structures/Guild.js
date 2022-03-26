const { Structures } = require('discord.js')
const { Logger } = require('advanced-command-handler');
const StateManager = require('../../utils/StateManager');

Structures.extend('Guild', (Guild) => {
    class CustomGuild extends Guild {
        constructor(client, data){
            super(client,data)

            this.guildId = data.id;
        }

        async getLeaderboard() {
            let lb;
            await StateManager.connection.query(`SELECT * FROM coins WHERE guildId = '${this.guildId}'`).then((res) => {
                lb = Object.entries(res[0]).sort((a, b) => b[1].coins - a[1].coins)
            })

            return lb.filter(user =>

                user[1].userId !== "188356697482330122" && user[1].userId !== "828807218849251338" && user[1].userId !== "549939615516065798"

            ).slice(0, 10).map((user, i) => i + 1 === 1 ? ` ${i + 1} . <@${user[1].userId}>: ${user[1].coins.toLocaleString()} coins` : i + 1 === 2 ? ` ${i + 1} . <@${user[1].userId}>: ${user[1].coins.toLocaleString()} coins` : i + 1 === 3 ? ` ${i + 1} . <@${user[1].userId}>: ${user[1].coins.toLocaleString()} coins` : `${i + 1} . <@${user[1].userId}>: ${user[1].coins.toLocaleString()} coins`)
        }



    }
    return CustomGuild
})