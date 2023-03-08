const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SlashCommandBuilder,
} = require('discord.js');

// Require Embed Generator
const embGen = require('../Classes/embedGen.js');

// Import arrays
let { accepted, maybe, declined } = require('../Data/arrays');

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
        .setName('month')
        .setDescription('Choose the month of the event')
        .setRequired(true)
        .addChoices(
          {
            name: 'January',
            value: 'January',
          },
          {
            name: 'February',
            value: 'February',
          },
          {
            name: 'March',
            value: 'March',
          },
          {
            name: 'April',
            value: 'April',
          },
          {
            name: 'May',
            value: 'May',
          },
          {
            name: 'June',
            value: 'June',
          },
          {
            name: 'July',
            value: 'July',
          },
          {
            name: 'August',
            value: 'August',
          },
          {
            name: 'September',
            value: 'September',
          },
          {
            name: 'October',
            value: 'October',
          },
          {
            name: 'November',
            value: 'November',
          },
          {
            name: 'December',
            value: 'December',
          }
        )
    )
    .addStringOption(option =>
      option
        .setName('day')
        .setDescription('Day of the month for the event')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('year')
        .setDescription('What year for the event')
        .setRequired(true)
        .addChoices(
          {
            name: '2023',
            value: '2023',
          },
          {
            name: '2024',
            value: '2024',
          },
          {
            name: '2025',
            value: '2025',
          },
          {
            name: '2026',
            value: '2026',
          },
          {
            name: '2027',
            value: '2027',
          },
          {
            name: '2028',
            value: '2028',
          },
          {
            name: '2029',
            value: '2029',
          },
          {
            name: '2030',
            value: '2030',
          }
        )
    )
    .addStringOption(option =>
      option.setName('hour').setDescription('What hour?').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('minute').setDescription('What minute?').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('seconds').setDescription('What Second?').setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('Short informational message')
        .setRequired(true)
    ),

  async execute(interaction) {
    const header = interaction.options.getString('title');
    const month = interaction.options.getString('month');
    const day = interaction.options.getString('day');
    const year = interaction.options.getString('year');
    const hour = interaction.options.getString('hour');
    const minute = interaction.options.getString('minute');
    const sec = interaction.options.getString('seconds');
    const msgValue = interaction.options.getString('message');

    // Convert time to unix for countdown Timer Display
    const eventDate =
      month + ' ' + day + ', ' + year + ' ' + hour + ':' + minute + ':' + sec;
    const time = new Date(eventDate).getTime() / 1000;

    // Timer for the collector to match given time by user.
    const collectTime = new Date(eventDate).getTime() - Date.now();

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
    const regMsg = regEmb.generateRegEmb(header, time, msgValue);

    // Send reply to user
    await interaction.reply({
      content: `${header} at ${eventDate}
       ${msgValue}`,
      ephemeral: true,
    });

    // Post Embed with values
    let outPut = await interaction.channel.send({
      embeds: [regMsg],
      components: [buttons],
    });
    outPut;

    console.log(outPut.components);

    const collector = outPut.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: collectTime,
    });

    // Handle button Interaction
    collector.on('collect', async i => {
      // Add users to user arrays
      // Accepted
      if (i.customId === 'Accepted') {
        // Check to see if user already accepted
        if (!accepted.includes(`${i.user.username}`)) {
          // check for user and index!
          let searchInd = maybe.findIndex(u => u === i.user.username);
          let searchInd1 = declined.findIndex(u => u === i.user.username);
          // Remove user from other arrays
          if (searchInd === -1) {
            console.log('No Users found');
          } else {
            maybe.splice(searchInd, 1);
            console.log('Removed user: ' + i.user.username + ' from maybe!');
          }
          if (searchInd1 === -1) {
            console.log('No Users found');
          } else {
            declined.splice(searchInd1, 1);
            console.log(`Removed user: ` + i.user.username) + ' from declined!';
          }
          // Add user to new array
          accepted.push(`${i.user.username}`);
        } else {
          console.log(`${i.user.username} already accepted!...`);
        }
      }
      // Maybe
      if (i.customId === 'Maybe') {
        if (!maybe.includes(`${i.user.username}`)) {
          let searchInd = accepted.findIndex(u => u === i.user.username);
          let searchInd1 = declined.findIndex(u => u === i.user.username);

          if (searchInd === -1) {
            console.log('No Users found');
          } else {
            accepted.splice(searchInd, 1);
            console.log('Removed user: ' + i.user.username + ' from accepted!');
          }
          if (searchInd1 === -1) {
            console.log('No Users found');
          } else {
            declined.splice(searchInd1, 1);
            console.log('Removed user: ' + i.user.username + ' from declined!');
          }

          maybe.push(`${i.user.username}`);
        } else {
          console.log(`${i.user.username} still isn't sure!...`);
        }
      }
      // Declined
      if (i.customId === 'Declined') {
        if (!declined.includes(`${i.user.username}`)) {
          let searchInd = accepted.findIndex(u => u === i.user.username);
          let searchInd1 = maybe.findIndex(u => u === i.user.username);

          if (searchInd === -1) {
            console.log('No Users found');
          } else {
            accepted.splice(searchInd, 1);
            console.log('Removed user: ' + i.user.username + ' from accepted!');
          }
          if (searchInd1 === -1) {
            console.log('No Users found');
          } else {
            maybe.splice(searchInd1, 1);
            console.log('Removed user: ' + i.user.username + ' from maybe!');
          }

          declined.push(`${i.user.username}`);
        } else {
          console.log(`${i.user.username} has already declined!...`);
        }
      }

      // Edited Embed
      const regEdEmb = new embGen();
      const regEdMsg = regEdEmb.generateRegEdEmb(
        header,
        time,
        msgValue,
        accepted,
        maybe,
        declined
      );

      if (i.customId === 'Accepted' || 'Maybe' || 'Declined') {
        i.update({
          embeds: [regEdMsg],
          components: [buttons],
        });
      }
    });

    collector.on('end', collected => {
      // Final edit
      const regFinEmb = new embGen();
      const regFinMsg = regFinEmb.generateRegFinEmb();

      setTimeout(() => {
        outPut.edit({ embeds: [regFinMsg], components: [] });
      }, 5000);

      console.log(`${collected.size} interactions recieved!.`);
    });
  },
};
