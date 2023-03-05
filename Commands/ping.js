const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Checks users ping!'),

  async execute(interaction) {
    await interaction.reply({
      content: 'Thanks, Checking now...',
      ephemeral: true,
    });
    await interaction.channel
      .send(
        `${interaction.user.username} your ping is: ${interaction.client.ws.ping}ms`
      )
      .then(msg => {
        msg.edit(
          `${interaction.user.username} your ping is ${
            interaction.client.ws.ping
          }ms and your latency is: ${
            msg.createdTimestamp - interaction.createdTimestamp
          }ms`
        );
      });
  },
};
