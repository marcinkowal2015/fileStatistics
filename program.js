const fileUtils = require('./fileUtils');

const path = process.argv[2];

fileUtils.countFiles(path).then(result => console.log(JSON.stringify(result)));
