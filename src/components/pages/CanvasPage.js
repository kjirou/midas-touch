import React from 'react';
import ReactDOM from 'react-dom';

import Page from './Page';


// TODO
// - Show a controller
// - Save to own device as the data-uri format
// - Undo/Redo

export default class CanvasPage extends Page {

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
    console.log('touchstart', event);
  }

  _handleCanvasTouchMove(event) {
    event.stopPropagation();
    event.preventDefault();
    console.log('touchmove', event);
  }

  _handleCanvasTouchEnd(event) {
    console.log('touchend', event);
  }

  componentDidMount() {
    const canvas = this._findCanvasNode();

    const ctx = canvas.getContext('2d');
    //ctx.fillStyle = 'green';
    ctx.fillRect(10, 20, 50, 100);
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
