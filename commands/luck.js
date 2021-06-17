// Import coinkey for creating random bitcoin key pairs and node-fetch, used to check wallets balance
const CoinKey = require('coinkey');
const fetch2 = require('node-fetch');

// i will be used as a counter, to make sure that no more than 10 wallets and seeds are generated
var i = 0;
// Wallets will be used to store all newly generated wallets and their corresponding private keys, with their balances
const wallets = {};

// Luck function
module.exports = function(msg) {
  
    // Ignoring some bs warning 
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  
    // Specify request method and api url
    const settings = { method: "Get" };
    const url = 'https://blockchain.info/balance?active='
    
    // Wait a bit before performing the request, blockhain doesn't allow too quick requests one after another
    setTimeout(async function() {
        
        // Generate random bitcoin wallet & private key pay from a random 64 hex string
        const ck = new CoinKey(Buffer.from(r(64), 'hex'));
        ck.compressed = false;
        
        // Define public address and private key (wif format)
        const pub = ck.publicAddress;
        const priv = ck.privateWif;
        
        // Make request to blockchain api and collect wallet balance
        await fetch2(url + pub.toString(), settings)
        .then(res => res.json())
        .then(json => {
            const balance = json[pub]['final_balance'];
            wallets[pub] = priv + "," + balance;
        })
      
        // Catch errors if any occur
        .catch(error => {
            console.log("error");
        });
        i++; // Add 1 to the counter
        
        // If counter isn't 10 yet, generate another bitcoin key pair
        if (i < 10) {
            module.exports(msg);
          
        // If we finally generated all 10 wallets
        } else {
            var finalWallets = ""; // This will be used to create a properly formatted description for embed message
          
            // Go through all the btc addresses in the wallets dictionary that we added
            for (const [key, value] of Object.entries(wallets)) {
              
                // Separate private key and wallet balance
                const vSeparated = value.split(",");
              
                // Add a line to the finalWallets string
                finalWallets = finalWallets + `[${vSeparated[0]}](https://www.blockchain.com/btc/address/${key}) ($${vSeparated[1]})\n\n`;
            }
          
            // Create our embed message and set some settings for it
            const Discord = require('discord.js');
            const embed = new Discord.MessageEmbed()
            .setColor('#f7941a')
            .setTitle('Random Seeds')
            .setAuthor('Bitcoin', 'https://bitmarket.pl/wp-content/uploads/2020/10/Bitcoin.svg_.png')
            .setDescription(finalWallets);
            
            // Reply to us on discord with an embed message
            msg.reply(embed);
          
            // Set i to 0 again and delete everything for the wallets dictionary incase we want to call the luck command again
            i = 0;
            for (const [key, value] of Object.entries(wallets)) {
                delete wallets[key];
            }
        }
    }, 200) // 200 milliseconds delay is enough to not get banned by blockchain, and qui
};

// The function to generate random 64 hex string
function r(l) {
    let randomChars = 'ABCDF0123456789';
    let result = '';
    for ( var i = 0; i < l; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
};
