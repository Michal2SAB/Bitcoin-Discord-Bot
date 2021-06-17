// Import discord.js and define client
const { Client } = require('discord.js');
const client = new Client();

// Import command handler
const CMDHandler = require('./cmdhandler');

// Set user status and let us know the bot started
client.on('ready', () => {
    client.user.setActivity("/luck", {type: 3})
    console.log(`Logged in as ${client.user.tag}`);
    console.log("");
});

// Handle commands
client.on('message', CMDHandler);

// Login to discord with bot token
client.login(process.env.bot_token);
