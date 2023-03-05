const { SlashCommandBuilder } = require('discord.js');
// Require Embed Generator
const embGen = require('../Classes/embedGen.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('registration')
    .setDescription('Allows users to sign up for the event')
    .addStringOption(option =>
      option
        .setName('title')
        .setDescription('Name of the event')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('time')
        .setDescription('Date and time of the Event')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Short informational message')
        .setRequired(true)
    ),

  async execute(interaction) {
    const header = interaction.options.getString('title');
    const date = interaction.options.getString('time');
    const msgValue = interaction.options.getString('message');

    const regEmb = new embGen();
    const regMsg = regEmb.generateRegEmb(header, date, msgValue);

    await interaction.reply({
      content: `${header} at ${date}
       ${msgValue}`,
      ephemeral: true,
    });
    await interaction.channel.send({ embeds: [regMsg] });
  },
};
