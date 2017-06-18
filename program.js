const fileStatistics = require('./fileStatistics');

fileStatistics.countStats().then(x => console.log(x));
fileStatistics.statsDetails().then(x => console.log(x));