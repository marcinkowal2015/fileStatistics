const fileStatistics = require('./fileStatistics');
const connection = require('./connectionProvider');


fileStatistics.countStats().then(stats => {
    connection.insertOneInCollection('fileStats', stats);
});
fileStatistics.statsDetails().then(details => {
    connection.insertOneInCollection('fileStatsDetails', details);
});