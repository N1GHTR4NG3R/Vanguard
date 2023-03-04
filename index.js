// Require discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
// Require environment
const dotenv = require('dotenv');
dotenv.config();

// Assign Token
const token = process.env.DISCORD_TOKEN;

// Create client Instance
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once(Events.ClientReady, (b) => {
  console.log(`${b.user.username} is online and ready to rumble! `);
});

bot.login(token);
