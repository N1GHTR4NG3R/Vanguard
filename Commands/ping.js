const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Checks users ping!'),

  async execute(interaction) {
    await interaction.reply(
      `${interaction.user.username} your ping is: ${interaction.client.ws.ping}ms`
    );
    await interaction
      .editReply({
        content: 'Calculating your latency...',
        fetchReply: true,
      })
      .then(msg => {
        msg.edit(
          `Your ping is ${interaction.client.ws.ping}ms and your latency is: ${
            msg.createdTimestamp - interaction.createdTimestamp
          }ms`
        );
      });
  },
};
