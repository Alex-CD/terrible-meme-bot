const path = require('path')
const Discord = require('discord.js')
const client = new Discord.Client()

const Router = require('./command_router')
const PlayerManager = require('./player_manager')
const Request = require('./request')

require('dotenv').config({ path: path.join(__dirname, '../.env') })

const settings = { prefix: process.env.DEFAULT_COMMAND_PREFIX }
process.title = process.env.PROCESS_TITLE

const playerMAnager = new PlayerManager()

// Import all modules from commands/
const commands = require('require-all')({
  dirname: path.join(__dirname, 'commands'),
  resolve: function (Command) {
    return new Command(settings, playerMAnager)
  }
})

const router = new Router(settings, playerMAnager, commands)

client.once('ready', () => {
  console.log('Connected')
})

client.login(process.env.DISCORD_TOKEN)

client.on('message', message => {
  router.route(new Request(message))
})

process.on('SIGINT', () => {
  client.destroy()
  process.exit()
})

process.on('unhandledRejection', (error) => {
  console.log('Unhandled promise rejection:' + error)
})
