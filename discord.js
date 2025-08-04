const { Client, GatewayIntentBits, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { REST, Routes } = require('discord.js');

const DISCORD_TOKEN = 'MTQwMTYyODY0MzI1NTM5MDMwMA.GZiOQF.ItSL9-G_Te2ebbUasayZ9MNBMK2REEwoWlfq9s'; // Your bot token
const CLIENT_ID = '1401628643255390300'; // Your client ID
const GUILD_ID = '1166591318735200256'; // Your guild (server) ID

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Register the /run command for your guild
const commands = [
  new SlashCommandBuilder()
    .setName('run')
    .setDescription('Opens a menu'),
];

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands.map(cmd => cmd.toJSON()) },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'run') {
      const menu = new StringSelectMenuBuilder()
        .setCustomId('select-menu')
        .setPlaceholder('Choose an option')
        .addOptions([
          {
            label: 'Option 1',
            description: 'This is option 1',
            value: 'option1',
          },
          {
            label: 'Option 2',
            description: 'This is option 2',
            value: 'option2',
          },
        ]);

      const row = new ActionRowBuilder().addComponents(menu);

      await interaction.reply({ content: 'Please select an option:', components: [row], ephemeral: true });
    }
  } else if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'select-menu') {
      await interaction.update({ content: `You selected: ${interaction.values[0]}`, components: [] });
    }
  }
});

client.login(DISCORD_TOKEN);
