require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nacl = require('tweetnacl');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commandData = {
  name: 'run',
  description: 'Shows menu',
  options: []
};

// Register commands (guild and global)
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

app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

function verifyDiscordRequest(req) {
  const signature = req.get('X-Signature-Ed25519');
  const timestamp = req.get('X-Signature-Timestamp');
  const body = req.rawBody;

  if (!signature || !timestamp || !body) return false;

  return nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, 'hex'),
    Buffer.from(DISCORD_PUBLIC_KEY, 'hex')
  );
}

app.post('/interactions', (req, res) => {
  if (!verifyDiscordRequest(req)) {
    return res.status(401).send('Invalid request signature');
  }

  const interaction = req.body;

  if (interaction.type === 1) {
    return res.json({ type: 1 });
  }

  if (interaction.type === 2 && interaction.data.name === 'run') {
    return res.json({
      type: 4,
      data: {
        content: 'menu',
        components: [
          {
            type: 1,
            components: [
              {
                type: 3,
                custom_id: 'menu_select',
                placeholder: 'Choose an option',
                options: [
                  { label: 'Option 1', value: 'option1', description: 'First' },
                  { label: 'Option 2', value: 'option2', description: 'Second' }
                ]
              }
            ]
          }
        ]
      }
    });
  }

  if (interaction.type === 3 && interaction.data.custom_id === 'menu_select') {
    return res.json({
      type: 4,
      data: {
        content: `You picked: ${interaction.data.values[0]}`
      }
    });
  }

  res.status(400).send('Unknown interaction');
});

app.get('/', (req, res) => {
  res.send('Bot is online!');
});

app.listen(PORT, () => {
  console.log(`Bot listening on port ${PORT}`);
});
