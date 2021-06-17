// Import request-promise used to get data from an api
const rp = require('request-promise');

// Bitcoin id is 1, ethereum id is 2 on our api
const coins = {
    btc: '1',
    eth: '2'
};

// This is for the reply message, btc = bitcoin and eth = ethereum
const names = {
    btc: 'bitcoin',
    eth: 'ethereum'
};

// Bitcoin function
module.exports = function (msg, args, type) {
  
    // Specify request options, api url, and more
    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
            'start': coins[type],
            'limit': '1',
            'convert': 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.api_key
        },
        json: true,
        gzip: true
    };
    
    // Perform request to our api and collect the data we need
    rp(requestOptions).then(response => {
        const price = response['data'][0]['quote']['USD']['price'];
      
        // Convert bitcoin value to USD dollars, using the current bitcoin price that we just recieved
        const converted = parseFloat(args[0]) * price;
        const converted2 = converted.toString().split('.');
        const realNumber = converted2[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const finalNumber = realNumber + '.' + converted2[1];
        
        // Reply to us on discord with the response
        msg.reply(`${args} ${names[type]} is currently worth $${finalNumber}`);
      
    // Catch errors if any occur
    }).catch((err) => {
        console.log('API call error:', err.message);
    });
};

