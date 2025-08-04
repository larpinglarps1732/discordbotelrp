require('dotenv').config();
const fetch = require('node-fetch');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commandData = {
  name: 'run',
  description: 'Shows menu',
  options: []
};

async function registerGuildCommand() {
  if (!GUILD_ID) {
    console.log('GUILD_ID not set, skipping guild command registration.');
    return;
  }
  const url = `https://discord.com/api/v10/applications/${CLIENT_ID}/guilds/${GUILD_ID}/commands`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${DISCORD_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commandData)
  });

  if (response.ok) {
    console.log('Guild /run command registered!');
  } else {
    const error = await response.json();
    console.error('Failed to register guild command:', error);
  }
}

async function registerGlobalCommand() {
  const url = `https://discord.com/api/v10/applications/${CLIENT_ID}/commands`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${DISCORD_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(commandData)
  });

  if (response.ok) {
    console.log('Global /run command registered! (may take ~1 hour to appear)');
  } else {
    const error = await response.json();
    console.error('Failed to register global command:', error);
  }
}

async function registerCommands() {
  await registerGuildCommand();
  await registerGlobalCommand();
}

registerCommands();
