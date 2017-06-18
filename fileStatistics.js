const fileUtils = require('./fileUtils');
const fs = require('fs');
const config = require('./config');

exports.statsDetails = function() {
    return config.getEntries()
        .then(entries => {
            const entriesFilesStats = entries.map(entry => {
                return Promise.all([countFiles(entry), entry])
                    .then(stats => {
                        return {
                            path: stats[1],
                            javascript: stats[0][0],
                            typescript: stats[0][1]
                        }
                    });
            });
            return Promise.all(entriesFilesStats);
        }).then(details => {
            return {
                date: new Date(),
                details: details
            }
        })
};

exports.countStats = function() {
    return config.getEntries()
        .then(entries => {
            const entryFilesStats = entries.map(entry => countFiles(entry));
            return Promise.all(entryFilesStats);
        }).then(statsList => {
            return statsList.reduce((prev, next) => {
                return [prev[0] + next[0], prev[1] + next[1]];
            }, [0, 0]);
        }).then(stats => {
            return {
                date: new Date(),
                javascript: stats[0],
                typescript: stats[1]
            }
        });
};

countFiles = function countFiles(path) {
    const filesPromise = new Promise((resolve) => {
        fs.readdir(path, (err, data) => {
            resolve(data);
        })
    });

    const fileStatsPromise = filesPromise.then(files => {
        const jsFilesNumber = fileUtils.countFileByExt(files, "js");
        const tsFilesNumber = fileUtils.countFileByExt(files, "ts");
        const mapFilesNumber = fileUtils.countFileByExt(files, "js.map");
        const typingsFilesNumber = fileUtils.countFileByExt(files, "d.ts");
        return [jsFilesNumber - mapFilesNumber, tsFilesNumber - typingsFilesNumber];
    });

    const dirNamesPromise = filesPromise.then(files => {
        const isDirPromises = files.map(file => {
            const filePath = `${path}/${file}`;
            return fileUtils.isDirectoryPromise(filePath);
        });

        return Promise.all(isDirPromises);
    }).then(isDirProps => {
        const dirs = isDirProps
            .filter(isDirProp => isDirProp[0])
            .map(dirProp => countFiles(dirProp[1]));
        return Promise.all(dirs);
    }).then(x => {
        return x.reduce((prev, next) => {
            return [prev[0] + next[0], prev[1] + next[1]];
        }, [0, 0])
    });

    return Promise.all([fileStatsPromise, dirNamesPromise])
        .then(x => [x[0][0] + x[1][0], x[0][1] + x[1][1]]);
};