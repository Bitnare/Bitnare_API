const NodeGeoCoder = require('node-geocoder');

const options = {
    provider : 'mapquest' ,
    httpAdapter : 'https',
    apiKey : '5JlkwarymGwWAm1qZai8Ce8dHAFPNYHd',
    formatter : null
};

const geoCoder = NodeGeoCoder(options);

module.exports = geoCoder;