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

function countFilesInDir(path) {
    const filesPromise = new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            resolve(data);
        })
    });

    const fileStatsPromise = filesPromise.then(files => {
        const jsFilesNumber = countFileByExt(files, "js");
        const tsFilesNumber = countFileByExt(files, "ts");
        const mapFilesNumber = countFileByExt(files, "js.map");
        return [jsFilesNumber - mapFilesNumber, tsFilesNumber];
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
            .map(dirProp => countFilesInDir(dirProp[1]));
        return Promise.all(dirs);
    });
    return Promise.all([fileStatsPromise, dirNamesPromise]);
}

const path = process.argv[2];

countFilesInDir(path).then(result => console.log(JSON.stringify(result)));
