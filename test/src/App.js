import assert from 'power-assert';

import App from 'src/App';
import Command from 'src/lib/Command';
import AppModel from 'src/models/AppModel';


describe('src/App', () => {
  it('constructor', () => {
    new App();
  });

  describe('commands creation', () => {
    it('should be', () => {
      const logics = {
        foo({ model }) {
          model._result = null;
        },
        bar({ model }, x) {
          model._result = x;
        },
      };

      const routes = {
        FOO: ['foo'],
        BAR: ['bar'],
        CURRIED_BAR: ['bar', [5]],
      };

      const appModel = new AppModel();

      const commands = App.prototype._createUiCommands(logics, routes, appModel);

      assert.strictEqual(Object.keys(commands).length, 3);

      assert.strictEqual(appModel._result, undefined);

      commands.FOO.execute();

      assert.strictEqual(appModel._result, null);

      commands.BAR.execute(2);

      assert.strictEqual(appModel._result, 2);

      commands.CURRIED_BAR.execute();

      assert.strictEqual(appModel._result, 5);
    });
  });
});
