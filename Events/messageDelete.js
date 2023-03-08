const { Events } = require('discord.js');

module.exports = {
  name: Events.MessageDelete,
  once: false,
  async execute(message, bot) {
    console.log(`Message deleted: ${message}`);
  },
};
