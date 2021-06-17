// Import request-promise used to get data from an api
const rp = require('request-promise');

// Bitcoin function
module.exports = function (msg, args) {
  
    // Specify request options, api url, and more
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
    
    // Perform request to our api and collect the data we need
    rp(requestOptions).then(response => {
        const price = response['data'][0]['quote']['USD']['price'];
      
        // Convert bitcoin value to USD dollars, using the current bitcoin price that we just recieved
        const converted = parseFloat(args[0]) * price;
        const converted2 = converted.toString().split('.');
        const realNumber = converted2[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const finalNumber = realNumber + '.' + converted2[1];
        
        // Reply to us on discord with the response
        msg.reply(`${args} bitcoin is currently worth $${finalNumber}`);
      
    // Catch errors if any occur
    }).catch((err) => {
        console.log('API call error:', err.message);
    });
}
