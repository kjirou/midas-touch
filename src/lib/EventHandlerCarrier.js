import React from 'react';


/*
 * Wrap event handler for carrying to partial components
 *
 * The carried event handler should not depend on dynamic `this` variabales
 */
export default class EventHandlerCarrier {
  /*
   * @param {Function} eventHandler
   * @param {Function} emitterType - A one of the React.Component and its subclasses
   */
  constructor(eventHandler, emitterType = React.Component) {
    this._eventHandler = eventHandler;
    this._emitterType = emitterType;
  }

  /*
   * @param {ReactComponent} emitter
   */
  bindContexts(emitter, ...boundArgs) {
    if (!(emitter instanceof this._emitterType)) {
      throw new Error(`${ emitter.constructor.name } is not expected, it should be a ${ this._emitterType.name }`);
    }

    const boundHandler = this._eventHandler.bind(null, ...boundArgs);

    return (...args) => boundHandler(...args, emitter);
  }
}
