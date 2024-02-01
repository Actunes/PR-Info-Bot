const Discord = require("discord.js")
const cron = require("cron")
const serverInfoModule = require('./protocol.js')
const client = require("..")

function updateBotStatus(serverInfo) {
    const {
        serverFound,
        mapName,
        playersP,
        playersT,
        gameTypeEx,
        gameLayoutEx
    } = serverInfo

    const presence = {
        activities: [{
            type: Discord.ActivityType.Custom,
            name: serverFound ? `Playing` : 'Error',
            state: serverFound ?
                `🟢 ${mapName} [${playersP}|${playersT}] - ${gameTypeEx} ${gameLayoutEx}` :
                '🔴 Server offline or unavailable'
        }]
    }

    client.user.setPresence(presence)
}

client.once("ready", () => {
    const attStatus = new cron.CronJob("*/5 * * * * *", async () => {
        const serverInfo = serverInfoModule.getServerInfo()
        updateBotStatus(serverInfo)
    })

    attStatus.start()
})
