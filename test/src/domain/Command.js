import assert from 'power-assert';

import Command from 'src/domain/Command';
import AppModel from 'src/models/AppModel';


describe('src/domain/Command', () => {
  describe('_resolveLogic', () => {
    it('should return a promisified result', () => {
      const logic = (deps, x, y) => {
        return x * y;
      };

      return Command._resolveLogic(logic, {}, [2, 3])
        .then(result => assert.strictEqual(result, 6))
      ;
    });

    it('should return a promisified error', () => {
      const logic = (deps) => {
        return new Error('Hello, error!');
      };

      return Command._resolveLogic(logic, {})
        .catch(err => {
          assert(err instanceof Error);
          assert.strictEqual(err.message, 'Hello, error!');
        });
      ;
    });

    it('can return resolved promise', () => {
      const logic = (deps) => {
        return Promise.resolve(100);
      };

      return Command._resolveLogic(logic, {})
        .then(result => assert.strictEqual(result, 100))
      ;
    });

    it('can return rejected promise', () => {
      const logic = (deps) => {
        return Promise.reject(new Error('This is a error'));
      };

      return Command._resolveLogic(logic, {})
        .catch(err => {
          assert(err instanceof Error);
          assert.strictEqual(err.message, 'This is a error');
        });
      ;
    });

    it('can handle unexpected error in the logic', () => {
      const logic = (deps) => {
        throw new Error('Unexpected error');
      };

      return Command._resolveLogic(logic, {})
        .catch(err => {
          assert(err instanceof Error);
          assert.strictEqual(err.message, 'Unexpected error');
        });
      ;
    });
  });

  describe('commandifyLogic', () => {

    it('should be', () => {
      const command = new Command();
      const appModel = new AppModel();
      const logic = ({ model }, x, y) => {
        return x * y + y;
      };

      command.commandifyLogic(logic, appModel);

      return command.execute(2, 3)
        .then(result => assert.strictEqual(result, 9))
      ;
    });

    it('curry args', () => {
      const command = new Command();
      const appModel = new AppModel();
      const logic = ({ model }, x, y) => {
        return x * y + y;
      };

      command.commandifyLogic(logic, appModel, [5]);

      return command.execute(10)
        .then(result => assert.strictEqual(result, 60))
      ;
    });
  });
});
