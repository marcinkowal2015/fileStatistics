exports.countFiles = countFiles;
//==============================

const fs = require('fs');

function countFileByExt(filesList, ext) {
    const numberOfFiles = filesList.filter(file => {
        return file.endsWith(`.${ext}`);
    }).length;

    return numberOfFiles;
}

function isDirectoryPromise(filePath) {
    const isDirectory = new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            if(stats.isDirectory()) {
                resolve([true, filePath]);
            }
            resolve([false, filePath]);
        });
    });
    return isDirectory;
}

function countFiles(path) {
    const filesPromise = new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            resolve(data);
        })
    });

    const fileStatsPromise = filesPromise.then(files => {
        const jsFilesNumber = countFileByExt(files, "js");
        const tsFilesNumber = countFileByExt(files, "ts");
        const mapFilesNumber = countFileByExt(files, "js.map");
        const typingsFilesNumber = countFileByExt(files, "d.ts");
        return [jsFilesNumber - mapFilesNumber, tsFilesNumber - typingsFilesNumber];
    });

    const dirNamesPromise = filesPromise.then(files => {
        const isDirPromises = files.map(file => {
            const filePath = `${path}/${file}`;
            return isDirectoryPromise(filePath);
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
}