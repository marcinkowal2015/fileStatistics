const fs = require('fs');

exports.getEntries = function() {
    const getEntriesPromise = new Promise((resolve, reject) => {
        fs.readFile("./config.json", "utf8", (err, data) => {
            resolve(data);
        })
    }).then(content => {
        const contentJson = JSON.parse(content);
        return contentJson.entries;
    });

    return getEntriesPromise;
};

