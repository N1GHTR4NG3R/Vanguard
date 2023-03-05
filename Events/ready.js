// Start the Bot
const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(bot) {
    console.log(`${bot.user.username} is online and ready to rumble!`);
  },
};
