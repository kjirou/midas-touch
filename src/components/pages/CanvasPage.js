import React from 'react';
import ReactDOM from 'react-dom';

import Page from './Page';


export default class CanvasPage extends Page {

  _findCanvasNode() {
    return ReactDOM.findDOMNode(this).querySelector('.js-canvas-page__canvas');
  }

  componentDidMount() {
    const canvas = this._findCanvasNode();

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 100, 100);
  }

  render() {
    return (
      <div className="canvas-page">
        <canvas className="js-canvas-page__canvas" />
      </div>
    );
  }
}
