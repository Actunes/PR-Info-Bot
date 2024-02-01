const cron = require("cron")
const { GameDig } = require('gamedig')
require("dotenv").config()

const client = require("..")

const gameTypeMap = {
    "gpm_cq": "AAS",
    "gpm_insurgency": "Insurgency",
    "gpm_skirmish": "Skirmish",
    "gpm_gungame": "Gungame",
    "gpm_cnc": "CNC",
    "gpm_vehicles": "Vehicle Warfare",
    "gpm_coop": "Co-Operative",
}

const gameLayoutMap = {
    "16": "Infantry",
    "32": "Alternative",
    "64": "Standard",
    "128": "Large",
}

function mapGameType(gameType) {
    return gameTypeMap[gameType] || "Unknown"
}

function mapGameLayout(gameLayout) {
    return gameLayoutMap[gameLayout] || "Unknown"
}

let serverInfo = null

async function updateServerInfo() {
    try {
        const state = await GameDig.query({
            type: process.env.GAMEDIG_TYPE,
            host: process.env.GAMEDIG_HOST,
            port: process.env.GAMEDIG_PORT,
            listenUdpPort: process.env.GAMEDIG_LISTEN_UDP_PORT,
        })

        serverInfo = {
            serverFound: true,
            mapName: state.raw.mapname,
            playersP: state.raw.numplayers,
            playersT: state.raw.maxplayers,
            gameType: state.raw.gametype,
            gameLayout: state.raw.bf2_mapsize,
            serverName: state.raw.hostname,
            gameTypeEx: mapGameType(state.raw.gametype),
            gameLayoutEx: mapGameLayout(state.raw.bf2_mapsize),
            team1: state.raw.bf2_team1,
            team2: state.raw.bf2_team2,
        }
    } catch (error) {
        console.error(error)
        serverInfo = { serverFound: false }
    }
}

client.once("ready", () => {
    const attMap = new cron.CronJob("*/5 * * * * *", updateServerInfo)
    attMap.start()
})

module.exports = {
    getServerInfo: () => serverInfo || { serverFound: false }
}
