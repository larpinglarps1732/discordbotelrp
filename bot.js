app.post('/interactions', (req, res) => {
  if (!verifyDiscordRequest(req)) {
    return res.status(401).send('Invalid request signature');
  }

  const interaction = req.body;

  // Discord PING (verification)
  if (interaction.type === 1) {
    return res.json({ type: 1 });
  }

  // If it's the /run command
  if (interaction.type === 2 && interaction.data.name === 'run') {
    return res.json({
      type: 4, // CHANNEL_MESSAGE_WITH_SOURCE (responds to user)
      data: {
        content: 'Menu:',
        components: [
          {
            type: 1, // Action Row
            components: [
              {
                type: 3, // Select menu
                custom_id: 'menu_select',
                placeholder: 'Choose an option',
                options: [
                  { label: 'Option 1', value: 'option1', description: 'First option' },
                  { label: 'Option 2', value: 'option2', description: 'Second option' }
                ]
              }
            ]
          }
        ]
      }
    });
  }

  // When user picks something from the menu
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
