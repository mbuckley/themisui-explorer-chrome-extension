const zipFolder = require('zip-folder');
const path = require('path');
const packageConfig = require('../package.json');
const DIST_PATH = path.resolve(__dirname, '..', 'dist');
const RELEASE_PATH = path.join(DIST_PATH, 'themisui-explorer-v' + packageConfig.version + '.zip');

zipFolder(DIST_PATH, RELEASE_PATH, function(err) {
    if(err) {
        console.log('ERROR: ', err);
    } else {
        console.log('Release', RELEASE_PATH, 'created');
    }
});
