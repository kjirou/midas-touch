process.env.MIDAS_TOUCH_NODE_ENV = 'test';
process.env.NODE_PATH = [
  __dirname + '/..'
].join(':');
require('module')._initPaths();
