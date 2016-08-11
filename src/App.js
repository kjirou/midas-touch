import { EventEmitter } from 'events';
import React from 'react';

import RootProvider from './components/RootProvider';
import { PAGE_IDS } from './consts';


export default class App {

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

    // TODO: Move
    class UIEventPublisher extends EventEmitter {
      publish(eventName, ...args) {
        console.log('publish:', eventName, ...args);
        this.emit(eventName, ...args);
      }
    }
    this._uiEventPublisher = new UIEventPublisher();
  }

  createRootReactElement() {
    return React.createElement(RootProvider, {
      pageId: this._environments.initialPage,
      publisher: this._uiEventPublisher,
      screenSize: {
        width: this._environments.screenSize[0],
        height: this._environments.screenSize[1],
      },
    });
  }
}
