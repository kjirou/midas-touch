import React from 'react';
import ReactDOM from 'react-dom';

import Page from './Page';


// TODO
// - Draw lines
// - Show a controller
// - Save to own device as the data-uri format
// - Undo/Redo

export default class CanvasPage extends Page {

  constructor() {
    super();
    this._canvasContext = null;
  }

  _findCanvasNode() {
    return ReactDOM.findDOMNode(this).querySelector('.js-canvas-page__canvas');
  }

  _handleScroll(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  _handleWheel(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  _handleCanvasClick() {
    event.stopPropagation();
    event.preventDefault();
  }

  _handleCanvasMouseDown() {
    event.stopPropagation();
    event.preventDefault();
  }

  _handleCanvasTouchStart(evnet) {
  }

  _handleCanvasTouchMove(event) {
    event.stopPropagation();
    event.preventDefault();

    const touch = event.changedTouches.item(0);
    const touchX = Math.round(touch.clientX);
    const touchY = Math.round(touch.clientY);

    this._canvasContext.fillRect(touchX - 5, touchY - 5, 10, 10);
  }

  _handleCanvasTouchEnd(event) {
  }

  componentDidMount() {
    const canvas = this._findCanvasNode();
    this._canvasContext = canvas.getContext('2d');
  }

  render() {
    return (
      <div
        className="canvas-page"
        onScroll={ this._handleScroll.bind(this) }
        onWheel={ this._handleWheel.bind(this) }
      >
        <canvas
          className="js-canvas-page__canvas"
          width={ this.props.root.screenSize.width }
          height={ this.props.root.screenSize.height }
          onClick={ this._handleCanvasClick.bind(this) }
          onMouseDown={ this._handleCanvasMouseDown.bind(this) }
          onTouchStart={ this._handleCanvasTouchStart.bind(this) }
          onTouchMove={ this._handleCanvasTouchMove.bind(this) }
          onTouchEnd={ this._handleCanvasTouchEnd.bind(this) }
        />
      </div>
    );
  }
}
