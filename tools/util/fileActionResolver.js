const path = require('path');
const deleteFile = require('./requestDeleteFile');
const changeFile = require('./requestChangeFile');
const changeScriban =  require('./requestChangeScriban');
const Queue = require('./Queue');

const queue = new Queue();
module.exports.queueInstance = queue;
module.exports.fileActionResolver = function (fileEvent, filePath, server, login, password) {
    if (filePath.indexOf('.scriban') > -1) {
        return queue.add(() => changeScriban(filePath, server, login, password));
    }
    if (fileEvent == 'change' || fileEvent == 'add') {
        return queue.add(() => changeFile(filePath, server, mediaLibraryDestinationPath(filePath), login, password));
    } else if (fileEvent == 'unlink') {
        return queue.add(() => deleteFile(server, mediaLibraryDestinationPath(filePath), login, password));
    }
};

const mediaLibraryDestinationPath = (filePath) => path.relative(path.join(global.rootPath, 'Media Library'), filePath).replace(/\\/g,'/');