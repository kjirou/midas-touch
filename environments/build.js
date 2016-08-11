process.env.MIDAS_TOUCH_NODE_ENV = 'build';
process.env.NODE_PATH = [
  __dirname + '/..'
].join(':');
require('module')._initPaths();
