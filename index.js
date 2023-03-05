// Require handlers
const fs = require('node:fs');
const path = require('node:path');

// Require discord.js classes
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
} = require('discord.js');

// Require environment
const dotenv = require('dotenv');
dotenv.config();

// Assign Token
const token = process.env.DISCORD_TOKEN;

// Create client Instance
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

bot.commands = new Collection();

// Create Command Handler
const commandsPath = path.join(__dirname, 'Commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // set a new item in collection with key:value as commandName:exportedModule
  if ('data' in command && 'execute' in command) {
    bot.commands.set(command.data.name, command);
  } else {
    console.error(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Create Event Handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    bot.once(event.name, (...args) => event.execute(...args));
  } else {
    bot.on(event.name, (...args) => event.execute(...args));
  }
}

bot.login(token);
