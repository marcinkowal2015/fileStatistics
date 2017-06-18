const fs = require('fs');

exports.countFileByExt = function(filesList, ext) {
    const numberOfFiles = filesList.filter(file => {
        return file.endsWith(`.${ext}`);
    }).length;

    return numberOfFiles;
}

exports.isDirectoryPromise = function(filePath) {
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