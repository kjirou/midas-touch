import React from 'react';
import ReactDOM from 'react-dom';

import Page from './Page';


// TODO
// - Adjust to the center of lineWidth
// - Show a controller
// - Save to own device as the data-uri format

export default class CanvasPage extends Page {

  constructor() {
    super();

    this._canvasContext = null;

    /*
     * {(number[]|null)} - [x, y]
     */
    this._beforeMatrix = null;

    /*
     * {string[]} - [dataUri0, dataUri1, ..]
     */
    this._editHistory = [];

    this._editHistoryCursor = -1;

    /*
     * {object[]} - [{ timestamp }, { timestamp }, ..]
     */
    this._touchStarts = [];
  }

  _findCanvasNode() {
    return ReactDOM.findDOMNode(this).querySelector('.js-canvas-page__canvas');
  }

  _clear() {
    this._canvasContext.clearRect(0, 0,
      this.props.root.screenSize.width, this.props.root.screenSize.height);
  }

  _drawImageFromDataUri(dataUri) {
    const { width, height } = this.props.root.screenSize;
    const image = new Image(width, height);
    image.src = dataUri;
    this._canvasContext.drawImage(image, 0, 0, width, height);
  }

  _undo() {
    const previousEditHistoryCursor = this._editHistoryCursor - 1;
    const dataUri = this._editHistory[previousEditHistoryCursor];

    if (dataUri) {
      this._clear();
      this._drawImageFromDataUri(dataUri);
    }

    if (previousEditHistoryCursor >= -1) {
      this._editHistoryCursor = previousEditHistoryCursor;
    }
  }

  _redo() {
    const nextEditHistoryCursor = this._editHistoryCursor + 1;

    const dataUri = this._editHistory[nextEditHistoryCursor];
    if (dataUri) {
      this._clear();
      this._drawImageFromDataUri(dataUri);
      this._editHistoryCursor = nextEditHistoryCursor;
    }
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
    this._beforeMatrix = null;
  }

  _handleCanvasTouchMove(event) {
    event.stopPropagation();
    event.preventDefault();

    const touch = event.changedTouches.item(0);

    const beforeMatrix = this._beforeMatrix;
    const currentMatrix = [
      Math.round(touch.clientX),
      Math.round(touch.clientY),
    ];

    if (beforeMatrix !== null) {
      this._canvasContext.lineWidth = 1;
      this._canvasContext.beginPath();
      this._canvasContext.moveTo(beforeMatrix[0], beforeMatrix[1]);
      this._canvasContext.lineTo(currentMatrix[0], currentMatrix[1]);
      this._canvasContext.closePath();
      this._canvasContext.stroke();
    }

    this._beforeMatrix = currentMatrix;
  }

  _handleCanvasTouchEnd(event) {
    const canvas = this._findCanvasNode();

    // Add a history
    this._editHistory = this._editHistory.slice(0, this._editHistoryCursor + 1);
    this._editHistory.push(canvas.toDataURL());
    this._editHistory = this._editHistory.slice(-20);
    this._editHistoryCursor = this._editHistory.length - 1;

    this._touchStarts = [];
  }

  componentDidMount() {
    const canvas = this._findCanvasNode();
    this._canvasContext = canvas.getContext('2d');

    // Original multiple touch points event handler
    //   It uses the native "touchstart",
    //   because the React Component's `onTouchStart` does not have `event.changedTouches` now
    canvas.addEventListener('touchstart', (event) => {
      const nowTimestamp = new Date().getTime();

      this._touchStarts = this._touchStarts.filter(touchStart => touchStart.timestamp > nowTimestamp - 10);

      for (let i = 0; i < event.changedTouches.length; i += 1) {
        const touch = event.changedTouches.item(i);
        this._touchStarts.push({
          timestamp: nowTimestamp,
        });
      }

      if (this._touchStarts.length >= 2) {
        alert('Touch 2 or more points at the same time!');
        this._touchStarts = [];
      }
    });

    // For debug
    window.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 67:  // "c"
          this._clear();
          break;
        case 68:  // "d"
          console.log(this);
          break;
        case 82:  // "r"
          this._redo();
          break;
        case 85:  // "u"
          this._undo();
          break;
      }
    });
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
