const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require('discord.js');

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

    // Create arrays to handle users
    let accepted = [];
    let maybe = [];
    let declined = [];

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('Accepted')
          .setLabel('Accepted')
          .setStyle(ButtonStyle.Success)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('Maybe')
          .setLabel('Maybe')
          .setStyle(ButtonStyle.Primary)
      )
      .addComponents(
        new ButtonBuilder()
          .setCustomId('Declined')
          .setLabel('Declined')
          .setStyle(ButtonStyle.Danger)
      );

    // Original message
    const regEmb = new embGen();
    const regMsg = regEmb.generateRegEmb(header, date, msgValue);

    await interaction.reply({
      content: `${header} at ${date}
       ${msgValue}`,
      ephemeral: true,
    });
    await interaction.channel.send({ embeds: [regMsg], components: [buttons] });

    const collector = interaction.channel.createMessageComponentCollector();

    // Handle button Interaction
    collector.on('collect', async i => {
      // Add users to user arrays
      // Accepted
      if (i.customId === 'Accepted') {
        // Check to see if user already accepted
        if (!accepted.includes(`${i.user.username}`)) {
          // Check other arrays first!
          maybe = maybe.filter(item => item !== i.user.username);
          declined = declined.filter(item => item !== i.user.username);
          accepted.push(`${i.user.username}`);
          console.log('Accepted: ' + accepted);
        } else {
          console.log(`${i.user.username} already accepted!...`);
        }
      }
      // Maybe
      if (i.customId === 'Maybe') {
        if (!maybe.includes(`${i.user.username}`)) {
          accepted = accepted.filter(item => item !== i.user.username);
          declined = declined.filter(item => item !== i.user.username);
          maybe.push(`${i.user.username}`);
          console.log('Maybe: ' + maybe);
        } else {
          console.log(`${i.user.username} still isn't sure!...`);
        }
      }
      // Declined
      if (i.customId === 'Declined') {
        if (!declined.includes(`${i.user.username}`)) {
          accepted = accepted.filter(item => item !== i.user.username);
          maybe = maybe.filter(item => item !== i.user.username);
          declined.push(`${i.user.username}`);
          console.log('Declined: ' + declined);
        } else {
          console.log(`${i.user.username} has already declined!...`);
        }
      }

      // Edited Embed
      const regEdEmb = new embGen();
      const regEdMsg = regEdEmb.generateRegEdEmb(
        header,
        date,
        msgValue,
        accepted,
        maybe,
        declined
      );

      if (i.customId === 'Accepted') {
        i.update({
          embeds: [regEdMsg],
          components: [buttons],
        });
      }
      if (i.customId === 'Maybe') {
        i.update({
          embeds: [regEdMsg],
          components: [buttons],
        });
      }
      if (i.customId === 'Declined') {
        i.update({
          embeds: [regEdMsg],
          components: [buttons],
        });
      }
    });
  },
};
