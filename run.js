const { Client } = require('discord.js');
const rp = require('request-promise');
const CoinKey = require('coinkey');
const fetch2 = require('node-fetch');

const client = new Client();
const prefix = "/"

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
    if (msg.author.bot) return;
    if (msg.content.startsWith(prefix)) {
        const [cmd, ...args] = msg.content
            .trim()
            .substring(prefix.length)
            .split(/\s+/);

        if (cmd === "bitcoin") {
            bitcoin(msg, args);
        }

        if (cmd === "luck") {
            luck(msg);
        }
    }
});

function bitcoin(msg, args) {
    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
            'start': '1',
            'limit': '1',
            'convert': 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.api_key
        },
        json: true,
        gzip: true
    };

    rp(requestOptions).then(response => {
        const price = response['data'][0]['quote']['USD']['price'];
        const converted = parseFloat(args[0]) * price;
        const converted2 = converted.toString().split('.');
        const realNumber = converted2[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const finalNumber = realNumber + '.' + converted2[1];

        msg.reply(`${args} bitcoin is currently worth $${finalNumber}`);
    }).catch((err) => {
        console.log('API call error:', err.message);
    });
};

var i = 0;
const wallets = {};

async function luck(msg) {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const settings = { method: "Get" };
    const url = 'https://blockchain.info/balance?active='
    setTimeout(async function() { 
        const ck = new CoinKey(Buffer.from(r(64), 'hex'));
        ck.compressed = false;

        const pub = ck.publicAddress;
        const priv = ck.privateWif;

        await fetch2(url + pub.toString(), settings)
        .then(res => res.json())
        .then(json => {
            const balance = json[pub]['final_balance'];
            wallets[pub] = priv + "," + balance;
        })
        .catch(error => {
            console.log("error");
        });
        i++;
        if (i < 10) {
            luck(msg);
        } else {
            var finalWallets = "";
            for (const [key, value] of Object.entries(wallets)) {
                const vSeparated = value.split(",");
                finalWallets = finalWallets + `[${vSeparated[0]}](https://www.blockchain.com/btc/address/${key}) ($${vSeparated[1]})\n\n`;
            }
            const Discord = require('discord.js');
            const embed = new Discord.MessageEmbed()
            .setColor('#f7941a')
            .setTitle('Random Seeds')
            .setAuthor('Bitcoin', 'https://bitmarket.pl/wp-content/uploads/2020/10/Bitcoin.svg_.png')
            .setDescription(finalWallets);

            msg.reply(embed);
            i = 0;
            for (const [key, value] of Object.entries(wallets)) {
                delete wallets[key];
            }
        }
    }, 200)
};

function r(l) {
    let randomChars = 'ABCDF0123456789';
    let result = '';
    for ( var i = 0; i < l; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
};

client.login(process.env.bot_token);

