const StateManager = require('../utils/StateManager');
const { Event, Logger } = require('advanced-command-handler');
const usersMap = new Map();
const usersStatus = new Map();
const Player = require('../utils/structures/Player');
const booster = {
    "stream": 2,
    "default": 1,
    "mute": 0.5
}
module.exports = new Event(
    {
        name: 'guildMemberAdd',

    },
    async (handler, member) => {
        // await member.newPlayer();
    }
);

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
