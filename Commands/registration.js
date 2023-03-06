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
    const userId = interaction.user.id;

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
      // Create arrays to handle users
      let accepted = [];
      let maybe = [];
      let declined = [];

      // Add users to user arrays
      if (i.customId === 'Accepted') {
        // Check to see if user already accepted
        if (accepted.includes(`${i.user.username}`)) {
          console.log(`${i.user.username} already accepted...`);
        }
        // Check to see if user was previously unsure and remove then push
        if (maybe.includes(`${i.user.username}`)) {
          for (a = 0; a < maybe.length; a++) {
            if (maybe[a] === i.user.username) {
              maybe.splice(a, i.user.username);
              a--;
              accepted.push(`${i.user.username}`);
            }
          }
        }
        // Check to see if user previously declined and remove then push
        if (declined.includes(`${i.user.username}`)) {
          for (b = 0; b < declined.length; b++) {
            if (declined[b] === i.user.username) {
              declined.splice(b, i.user.username);
              b--;
              accepted.push(`${i.user.username}`);
            }
          }
          // Otherwise push to array
        } else {
          accepted.push(`${i.user.username}`);
        }
      }
      if (i.customId === 'Maybe') {
        if (maybe.includes(`${i.user.username}`)) {
          console.log(`${i.user.username} still isn't sure...`);
        }
        if (accepted.includes(`${i.user.username}`)) {
          for (a = 0; a < accepted.length; a++) {
            if (accepted[a] === i.user.username) {
              accepted.splice(a, i.user.username);
              a--;
              maybe.push(`${i.user.username}`);
            }
          }
        }
        if (declined.includes(`${i.user.username}`)) {
          for (b = 0; b < declined.length; b++) {
            if (declined[b] === i.user.username) {
              declined.splice(b, i.user.username);
              b--;
              maybe.push(`${i.user.username}`);
            }
          }
        } else {
          maybe.push(`${i.user.username}`);
        }
      }
      if (i.customId === 'Declined') {
        if (declined.includes(`${i.user.username}`)) {
          console.log(`${i.user.username} already declined...`);
        }
        if (accepted.includes(`${i.user.username}`)) {
          for (a = 0; a < accepted.length; a++) {
            if (accepted[a] === i.user.username) {
              accepted.splice(a, i.user.username);
              a--;
              declined.push(`${i.user.username}`);
            }
          }
        }
        if (maybe.includes(`${i.user.username}`)) {
          for (b = 0; b < maybe.length; b++) {
            if (maybe[b] === i.user.username) {
              maybe.splice(b, i.user.username);
              b--;
              declined.push(`${i.user.username}`);
            }
          }
        } else {
          declined.push(`${i.user.username}`);
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
      } else if (i.customId === 'Maybe') {
        i.update({
          embeds: [regEdMsg],
          components: [buttons],
        });
      } else if (i.customId === 'Declined') {
        i.update({
          embeds: [regEdMsg],
          components: [buttons],
        });
      }
    });
  },
};
