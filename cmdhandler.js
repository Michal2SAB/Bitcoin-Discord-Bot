// Load the commands
const bitcoin = require('./commands/bitcoin.js');
const luck = require('./commands/luck.js');

// Define command symbol
const prefix = "/";

// Keep all commands in one place
const cmds = { bitcoin, luck }

// Command handler function
module.exports = async function (msg) {
  
    // Just to be safe, ignore own messages
    if (msg.author.bot) return;
  
    // If message is a command and starts with our prefix
    if (msg.content.startsWith(prefix)) {
      
        // Split message into command name and its arguments if has any
        const [cmd, ...args] = msg.content
            .trim()
            .substring(prefix.length)
            .split(/\s+/);
      
        // Determine which command was called with const cmds defined above
        cmds[cmd](msg, args);
    }
};
