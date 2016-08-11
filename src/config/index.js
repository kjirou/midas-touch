const isNode = Boolean(typeof process === 'object' && process.env && process.env.MIDAS_TOUCH_NODE_ENV);
const isNodeTest = isNode && process.env.MIDAS_TOUCH_NODE_ENV === 'test';

const config = {
  landingPage: null,
};

const localConfig = require('./local').default;
localConfig(config);

if (isNodeTest) {
  config.landingPage = null;
}


export default config;
