const fetch = require('node-fetch');

const DISCORD_TOKEN = 'YOUR_BOT_TOKEN';
const CLIENT_ID = 'YOUR_CLIENT_ID';
const GUILD_ID = 'YOUR_GUILD_ID'; // For testing, register commands in a guild

const commandData = {
  name: 'run',
  description: 'Shows menu',
  options: []
};

async function registerCommand() {
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
    console.log('Command /run registered!');
  } else {
    const error = await response.json();
    console.error('Failed to register command:', error);
  }
}

registerCommand();
