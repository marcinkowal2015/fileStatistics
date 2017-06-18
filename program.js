const fileUtils = require('./fileUtils');
const config = require('./config');

const statsDetails = config.getEntries()
    .then(entries => {
        const entriesFilesStats = entries.map(entry => {
            return Promise.all([fileUtils.countFiles(entry), entry])
                .then(stats => {
                    return {
                        path: stats[1],
                        javascript: stats[0][0],
                        typescript: stats[0][1]
                    }
                });
        });
        return Promise.all(entriesFilesStats);
    });

const countStats = config.getEntries()
    .then(entries => {
        const entryFilesStats = entries.map(entry => fileUtils.countFiles(entry));
        return Promise.all(entryFilesStats);
    }).then(statsList => {
        const stats = statsList.reduce((prev, next) => {
            return [prev[0] + next[0], prev[1] + next[1]];
        },[0, 0]);
        return stats;
    }).then(stats => {
        return {
            date: new Date().toJSON().slice(0,10).replace(/-/g,'/'),
            javascript: stats[0],
            typescript: stats[1]
        }
    });

countStats.then(x => console.log(x));
statsDetails.then(x => console.log(x));