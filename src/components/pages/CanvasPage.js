import React from 'react';
import ReactDOM from 'react-dom';

import Page from './Page';


export default class CanvasPage extends Page {

  _findCanvasNode() {
  }

  componentDidMount() {
    console.log(1111);
  }

  render() {
    return (
      <div className="canvas-page">
        <div className="canvas-page__canvas .js-canvas-page__canvas" />
      </div>
    );
  }
}
