import { EventEmitter } from 'events';
import React from 'react';

import Root from './components/Root';
import { PAGE_IDS } from './consts';


export default class App {
  // TODO: Replace as a class
  static _createUIEventDispatcher() {
    const emitter = new EventEmitter();

    return emitter;
  }

  /*
   * @param {object} environments - Receive parameters from the outside of JS
   *                                ex) Brower APIs, URL, HTTP, Dev Settings ..etc
   */
  constructor(environments = {}) {
    this._environments = Object.assign({
      initialPage: PAGE_IDS.CANVAS,
      // {number[]} - [width, height]
      screenSize: [0, 0],
    }, environments);

    this._uiEventDispatcher = this.constructor._createUIEventDispatcher();
  }

  createRootReactElement() {
    return React.createElement(Root, {
      pageId: this._environments.initialPage,
      screenSize: {
        width: this._environments.screenSize[0],
        height: this._environments.screenSize[1],
      },
    });
  }
}
