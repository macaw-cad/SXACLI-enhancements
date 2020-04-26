const path = require('path');
const findUp = require('find-up');
const deleteFile = require('./requestDeleteFile');
const changeFile = require('./requestChangeFile');
const changeScriban =  require('./requestChangeScriban');
const Queue = require('./Queue');

const queue = new Queue();
module.exports.queueInstance = queue;
module.exports.fileActionResolver = function (file, server, login, password) {
    if (file.path.indexOf('.scriban') > -1) {
        return queue.add(() => changeScriban(file));
    }
    if (file.event == 'change' || file.event == 'add') {
        return queue.add(() => changeFile(file.path, server, mediaLibraryDestinationPath(file), login, password));
    } else if (file.event == 'unlink') {
        return queue.add(() => deleteFile(file.path, server, mediaLibraryDestinationPath(file), login, password));
    }
};

const mediaLibraryDestinationPath = (file) => path.relative(path.join(global.rootPath, 'Media Library'), file.path).replace(/\\/g,'/');