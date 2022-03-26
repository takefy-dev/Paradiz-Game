const StateManager = require('../utils/StateManager');
const { Event, Logger } = require('advanced-command-handler');
const booster = {
    "stream": 2,
    "default": 1,
    "mute": 0.5
}
module.exports = new Event(
    {
        name: 'voiceStateUpdate',

    },
    async (handler, oldState, newState) => {
        this.connection = StateManager.connection
        if (newState.bot) return;

        if (newState.channelID !== null) {
                    // if(!newState.member.register) {
                    //     await newState.member.newPlayer()
                    //     Logger.log(`${newState.id}`, `Creating a non register player`, 'red')

                    // }
                    let status = "default";
                    if (!oldState.streaming && newState.streaming || newState.selfVideo && !oldState.selfVideo) {
                        status = "stream";

                    } else if (oldState.streaming && !newState.streaming && !newState.selfVideo && oldState.selfVideo && oldState.selfMute && !newState.selfMute && !oldState.serverMute && newState.serverMute && oldState.serverDeaf && !newState.serverDeaf) {
                        status = "default";
                    } else if (!oldState.selfMute && newState.selfMute || !oldState.serverMute && newState.serverMute || !oldState.serverDeaf && newState.serverDeaf) {
                        status = "mute";
                    }
                handler.client.farmingCoins.set(newState.id, {
                    status,
                    boost: booster[status]
                })


        //     let userCoins = await Player.getCoins(newState.id, newState.guild.id)
        //     if (!userCoins && userCoins !== 0) userCoins = await Player.createPlayer(newState.member.user, newState.guild.id)
        //     usersStatus.set(newState.id, {status: "default", inVoiceAt: new Date().getTime()})
        //     let status = usersStatus.get(newState.id)
        //     if (!oldState.streaming && newState.streaming || newState.selfVideo && !oldState.selfVideo) {
        //         status.status = "stream";
        //
        //     } else if (oldState.streaming && !newState.streaming && !newState.selfVideo && oldState.selfVideo && oldState.selfMute && !newState.selfMute && !oldState.serverMute && newState.serverMute && oldState.serverDeaf && !newState.serverDeaf) {
        //         status.status = "default";
        //     } else if (!oldState.selfMute && newState.selfMute || !oldState.serverMute && newState.serverMute || !oldState.serverDeaf && newState.serverDeaf) {
        //         status.status = "mute";
        //     }
        //
        //     if(usersMap.has(newState.id)) return;
        //     usersMap.set(newState.id, true)
        //
        //     Logger.log(`${Logger.setColor('teal')} ${newState.member.user.tag} joined ${newState.channel.name}.`, 'JOIN INFO')
        //
        //     while (newState.channelID && usersStatus.has(newState.id)) {
        //
        //
        //         await sleep(1000);
        //
        //         userCoins += booster[usersStatus.get(newState.id).status];
        //         await Player.updateCoins(newState.id, newState.guild.id, userCoins)
        //         const now = new Date().getTime()
        //         const inVoiceAt = usersStatus.get(newState.id).inVoiceAt;
        //         if(now - inVoiceAt >= 2000){
        //             let playerStatus = await Player.getPlayer(newState.id, newState.guild.id)
        //             await Player.editPlayerProperties(newState.id, newState.guild.id, false, playerStatus[0].food - 1);
        //         }
        //
        //
        //     }
        //
        //
        //
        //
        } else {
            if(handler.client.farmingCoins.has(oldState.id)) handler.client.farmingCoins.delete(oldState.id)
            Logger.log(`${oldState.id || newState.id }`, `Player leaved`, 'orange')
        }

    }
);

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
