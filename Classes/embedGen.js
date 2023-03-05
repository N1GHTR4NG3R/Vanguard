const { EmbedBuilder } = require('discord.js');

/**
 * @description
 * This file is built to automatically generate embeds for use elsewhere, It's designed to keep code cleaner across the board
 * All Embeds should be commented in the following format:
 * Name: Descriptive Name
 * Description: Where it is associated
 * Additional Info: Line number of file its associated with in-case of multiple embeds.
 */

class embGen {
  /**
   * @param {string} bot References the bot
   * @param {string} header Title of the embed
   * @param {string} date Time input
   * @param {string} msgValue User inputted message
   */
  generateRegEmb(header, date, msgValue) {
    const newRegEmb = new EmbedBuilder()
      .setColor('#BB4D0E')
      .setTitle(`${header}`)
      .setDescription(`${msgValue}`)
      .setThumbnail(`https://i.ibb.co/phpWhJR/Vanguard-logo.png`)
      .addFields({ name: 'Time', value: `${date}` });
    return newRegEmb;
  }
}

module.exports = embGen;
