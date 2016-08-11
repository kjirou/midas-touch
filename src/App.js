import React from 'react';

import RootProvider from './components/RootProvider';
import { PAGE_IDS, STATE_EVENTS } from './consts';
import Command from './domain/Command';
import logics from './domain/logics';
import routes, { UI_EVENT_NAMES } from './domain/routes';
import StateEventEmitter from './lib/event-emitters/StateEventEmitter';
import UiEventEmitter from './lib/event-emitters/UiEventEmitter';
import AppModel from './models/AppModel';


export default class App {
  /*
   * @param {object} environments - Receive parameters from the outside of JS
   *                                ex) Brower APIs, URL, HTTP, ..etc
   */
  constructor(environments = {}) {
    this._environments = Object.assign({
      // {number[]} - [width, height]
      screenSize: [0, 0],
    }, environments);

    this._appModel = new AppModel();

    this._stateEventEmitter = new StateEventEmitter();

    this._uiEventEmitter = new UiEventEmitter();

    this._uiCommands = this._createUiCommands(routes, logics, this._appModel);

    this._subscribeUiEvents(this._uiCommands);
  }

  createReactElement() {
    return React.createElement(RootProvider, {
      initialState: this._generateState(),
      stateEventEmitter: this._stateEventEmitter,
      uiEventEmitter: this._uiEventEmitter,
    });
  }

  _createUiCommands(routes, logics, appModel) {
    const commands = {};

    Object.keys(routes).sort().map(uiEventName => {
      const [ logicName, curriedArgs ] = routes[uiEventName]
      const logic = logics[logicName];

      const command = new Command();
      command.commandifyLogic(logic, appModel, curriedArgs);

      commands[uiEventName] = command;
    });

    return commands;
  }

  /*
   * @return {object} - A JSON data for rendering
   */
  _generateState() {
    // TODO: Define a state tree, and builds a new state from received actions
    const state = {
      pageId: this._appModel.pageId,
      screenSize: {
        width: this._environments.screenSize[0],
        height: this._environments.screenSize[1],
      },
    };

    return state;
  }

  /*
   * @param {Command} command
   */
  _runFlux(command, commandArgs) {
    command.execute(...commandArgs)
      .then(() => {
        const state = this._generateState();
        this._stateEventEmitter.emit(STATE_EVENTS.CHANGE, state);
      })
      .catch(err => console.error(err.stack || err))
    ;
  }

  _subscribeUiEvents(uiCommands) {
    Object.keys(uiCommands).sort().forEach(uiEventName => {
      const command = uiCommands[uiEventName];
      const handler = (...args) => {
        this._runFlux(command, args);
      };
      this._uiEventEmitter.on(uiEventName, handler);
    });
  }
}
