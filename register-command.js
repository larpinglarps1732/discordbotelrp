const fetch = require('node-fetch');

const DISCORD_TOKEN = 'MTQwMTYyODY0MzI1NTM5MDMwMA.GZiOQF.ItSL9-G_Te2ebbUasayZ9MNBMK2REEwoWlfq9s';
const CLIENT_ID = '1401628643255390300';
const GUILD_ID = '1166591318735200256'; // Your test server ID

const commandData = {
  name: 'run',
  description: 'Shows menu',
  options: []
};

async function registerGuildCommand() {
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
