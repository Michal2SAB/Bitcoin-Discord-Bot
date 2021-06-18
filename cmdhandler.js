// Load the commands
const btc = require('./commands/cryptocurrency.js');
const eth = btc;
const luck = require('./commands/luck.js');
const calc = require('./commands/calc.js');
const bnews = require('./commands/bnews.js');

// Define command symbol
const prefix = "/";

// Keep all commands in one place
const cmds = { btc, eth, luck, calc, bnews }

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
        cmds[cmd](msg, args, cmd);
    }
};
