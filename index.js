const Discord = require("discord.js")
const chalk = require('chalk')
require("dotenv").config()

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildVoiceStates
    ]
})

module.exports = client

client.on("ready", () => {
    console.log(chalk.cyan(`[Bot] | online in ` + chalk.red(`${client.user.username}!`)))
})

client.on('interactionCreate', (interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const cmd = client.slashCommands.get(interaction.commandName)
        if (!cmd) return interaction.reply(`Error`)
        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id)
        cmd.run(client, interaction)
    }
})

require('./handler')(client)
require('./handler/events')

client.slashCommands = new Discord.Collection()

client.login(process.env.TOKEN)

process.on('unhandRejection', (reason, promise) => {
    console.log(`❗ | [Error]\n\n` + reason, promise)
})

process.on('uncaughtException', (error, origin) => {
    console.log(`❗ | [Error]\n\n` + error, origin)
})

process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.log(`❗ | [Error]\n\n` + error, origin)
})
