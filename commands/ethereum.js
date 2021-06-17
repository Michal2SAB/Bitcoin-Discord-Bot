const rp = require('request-promise');

module.exports = function (msg, args) {
    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
            'start': '2',
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

        msg.reply(`${args} ethereum is currently worth $${finalNumber}`);
    }).catch((err) => {
        console.log('API call error:', err.message);
    });
};
