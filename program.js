const fileStatistics = require('./fileStatistics');
const connection = require('./connectionProvider');


fileStatistics.countStats().then(stats => {
    console.log(stats);
    connection.insertOneInCollection('fileStats', stats);
});
fileStatistics.statsDetails().then(details => {
    console.log(details);
    connection.insertOneInCollection('fileStatsDetails', details);
});