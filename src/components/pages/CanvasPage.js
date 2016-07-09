import React from 'react';

import Page from './Page';


export default class CanvasPage extends Page {

  render() {
    return (
      <div className="canvas-page">
        <div className="canvas-page__canvas" />
      </div>
    );
  }
}
