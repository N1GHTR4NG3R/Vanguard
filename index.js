// Require handlers
const fs = require('node:fs');
const path = require('node:path');

// Require discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Require environment
const dotenv = require('dotenv');
dotenv.config();

// Assign Token
const token = process.env.DISCORD_TOKEN;

// Create client Instance
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

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

// Event/Command Listener
bot.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
});

// Start the Bot
bot.once(Events.ClientReady, b => {
  console.log(`${b.user.username} is online and ready to rumble! `);
});

bot.login(token);
