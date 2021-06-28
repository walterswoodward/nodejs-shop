const path = require('path');

// path.dirname returns the directory name of a path
// require.main.filename points to the main file from which this application was spun up (e.g. app.js)
module.exports = path.dirname(require.main.filename);