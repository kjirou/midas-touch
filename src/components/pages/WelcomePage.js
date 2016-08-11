import React from 'react';
import ReactDOM from 'react-dom';

import { UI_EVENT_NAMES } from '../../domain/routes';
import { ignoreNativeUIEvents } from '../../lib/utils';
import Page from './Page';


export default class WelcomePage extends Page {
  constructor() {
    super();
  }

  _onTouchStart() {
    this.context.emit(UI_EVENT_NAMES.TOUCH_START);
  }

  render() {
    return (
      <div
        className="welcome-page"
        onTouchStart={ this._onTouchStart.bind(this) }
      >
        Welcome!
      </div>
    );
  }
}
