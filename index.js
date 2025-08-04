const { Client, GatewayIntentBits, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, REST, Routes } = require('discord.js');

// Replace these with your actual values (hardcoded for now)
const DISCORD_TOKEN = 'MTQwMTYyODY0MzI1NTM5MDMwMA.Gqqs91.yA59CukSZwy5NiMS31hLq0ramEOpw6Zjgco9Uw';
const CLIENT_ID = '1401628643255390300';
const GUILD_ID = '1166591318735200256';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Define your commands
const commands = [
  new SlashCommandBuilder()
    .setName('run')
    .setDescription('Opens a dropdown menu'),

  new SlashCommandBuilder()
    .setName('commands')
    .setDescription('Lists all commands'),
];

// Register commands with Discord
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands.map(cmd => cmd.toJSON()) },
    );
    console.log('✅ Slash commands registered!');
  } catch (err) {
    console.error('❌ Error registering commands:', err);
  }
})();

// Handle interactions
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'run') {
      const menu = new StringSelectMenuBuilder()
        .setCustomId('select-menu')
        .setPlaceholder('Choose an option')
        .addOptions([
          { label: 'Option 1', value: 'option1', description: 'First option' },
          { label: 'Option 2', value: 'option2', description: 'Second option' },
        ]);

      const row = new ActionRowBuilder().addComponents(menu);

      await interaction.reply({ content: 'Choose an option:', components: [row], ephemeral: true });
    }

    if (interaction.commandName === 'commands') {
      await interaction.reply({
        content: '🧾 **Available Commands:**\n• `/run` — Opens a menu\n• `/commands` — Lists all commands',
        ephemeral: true
      });
    }
  }

  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'select-menu') {
      await interaction.update({
        content: `✅ You selected: ${interaction.values[0]}`,
        components: []
      });
    }
  }
});

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(DISCORD_TOKEN);
