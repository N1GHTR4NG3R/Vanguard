const { SlashCommandBuilder } = require('discord.js');
// Connect and update to google sheets api
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clrgoogle')
    .setDescription('Clears the Google Sheet!'),

  async execute(interaction) {
    // Reply to user, to let them know your updating.
    await interaction.reply({
      content: 'Thanks, updating now...',
      ephemeral: true,
    });

    /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */

    async function loadSavedCredentialsIfExist() {
      try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
      } catch (err) {
        return null;
      }
    }

    /**
     * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */

    async function saveCredentials(client) {
      const content = await fs.readFile(CREDENTIALS_PATH);
      const keys = JSON.parse(content);
      const key = keys.installed || keys.web;
      const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
      });
      await fs.writeFile(TOKEN_PATH, payload);
    }

    /**
     * Load or request or authorization to call APIs.
     *
     */

    async function authorize() {
      let client = await loadSavedCredentialsIfExist();
      if (client) {
        return client;
      }
      client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
      });
      if (client.credentials) {
        await saveCredentials(client);
      }
      return client;
    }

    /**
     * Prints the members in a sample spreadsheet:
     * @see https://docs.google.com/spreadsheets/d/1hH_EPPHtFb_pKlyUF_TcvGVzpQilAoZtP08eaNl0S04/edit
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     */

    // Function to clear sheet
    async function clearColumns(auth) {
      const sheets = google.sheets({ version: 'v4', auth });
      const Id = '1hH_EPPHtFb_pKlyUF_TcvGVzpQilAoZtP08eaNl0S04';

      const request = {
        spreadsheetId: Id,
        resource: {
          ranges: ['A3:A153', 'B3:B153', 'C3:C153'],
        },
      };

      try {
        const response = (await sheets.spreadsheets.values.batchClear(request))
          .data;
        console.log(JSON.stringify(response, null, 2));
      } catch (err) {
        console.error(err);
      }
    }

    authorize().then(clearColumns).catch(console.error);
  },
};
