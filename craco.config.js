const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@components': path.resolve(__dirname, './src/components'),
            '@helpers': path.resolve(__dirname, './src/helpers'),
            '@data': path.resolve(__dirname, './src/data')
        }
    }
};
