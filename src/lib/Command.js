/*
 * A command object of the Command Pattern
 */
export default class Command {
  constructor() {
    this._command = null;
  }

  /*
   * Resolve the logic execution by passing the dependencies and args
   *
   * @param {Function} logic - One of business logics
   * @param {object} dependencies - { appModel }
   * @param {Array} logicArgs
   */
  static _resolveLogic(logic, dependencies, logicArgs = []) {
    let result;

    try {
      result = logic(dependencies, ...logicArgs);
    } catch (err) {
      result = err;
    }

    // Convert to Promise-based API forcibly
    let promisifiedResult;
    if (result instanceof Promise) {
      promisifiedResult = result;
    } else if (result instanceof Error) {
      promisifiedResult = Promise.reject(result);
    } else {
      promisifiedResult = Promise.resolve(result);
    }

    return promisifiedResult;
  }

  /*
   * Convert a logic and its dependencies to a functional command
   *
   * @param {function} logic - A one of `src/domain/logics`
   * @param {AppModel} appModel
   * @param {array} curriedArgs
   */
  commandifyLogic(logic, appModel, curriedArgs = []) {
    const dependencies = {
      model: appModel,
    };

    const _resolveLogic = this.constructor._resolveLogic;
    const command = function(...runtimeArgs) {
      const logicArgs = curriedArgs.concat(runtimeArgs);
      return _resolveLogic(logic, dependencies, logicArgs);
    };

    this._command = command;
  }

  execute(...args) {
    return this._command(...args);
  }
}
