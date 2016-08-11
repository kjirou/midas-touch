import assert from 'power-assert';

import config from 'src/config';


describe('src/config', () => {

  it('should be', () => {
    assert.strictEqual(typeof config, 'object');
    assert('landingPageId' in config);
  });
});
