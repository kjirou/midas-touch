import { EventEmitter } from 'events';
import React from 'react';
import ReactDOM from 'react-dom';

import { POINTER_TYPES } from '../consts';
import EditHistory from '../lib/EditHistory';
import TouchStartReceiver from '../lib/TouchStartReceiver';
import { ignoreNativeUIEvents } from '../lib/utils';


export default class CanvasBoard extends React.Component {
  constructor(props) {
    super(props);

    this._config = {
      eraserWidth: 5,
      penWidth: 1,
      pointerType: POINTER_TYPES.PEN,
    };

    this._canvasContext = null;

    /*
     * {(number[]|null)} - [x, y]
     */
    this._beforeMatrix = null;

    this._editHistory = new EditHistory();

    this._touchStartReceiver = new TouchStartReceiver();

    this._emitter = new EventEmitter();

    this._emitter.on('config', (data) => {
      // TODO: filter by receivable keys
      Object.assign(this._config, data)
    });

    this._emitter.on('dump', () => {
      console.log(this);
    });

    this._emitter.on('clear', () => {
      this._clear();
    });

    this._emitter.on('undo', () => {
      this._undo();
    });

    this._emitter.on('redo', () => {
      this._redo();
    });
  }

  _clear() {
    this._canvasContext.clearRect(0, 0, this.props.width, this.props.height);
  }

  /*
   * TODO: This async processing is not managed
   * @return {Promise}
   */
  _restoreImageFromDataUri(dataUri) {
    const image = new Image(this.props.width, this.props.height);

    return new Promise((resolve) => {
      // This `load` should be use at least for the Moblie Safari
      image.addEventListener('load', () => {
        this._clear();
        this._canvasContext.globalCompositeOperation = 'source-over';
        this._canvasContext.drawImage(image, 0, 0, this.props.width, this.props.height);
        resolve();
      });
      image.src = dataUri;
    });
  }

  _undo() {
    const dataUri = this._editHistory.undo();

    if (dataUri) {
      this._restoreImageFromDataUri(dataUri);
    } else {
      this._clear();
    }
  }

  _redo() {
    const dataUri = this._editHistory.redo();

    if (dataUri) {
      this._restoreImageFromDataUri(dataUri);
    }
  }

  _emitMultiTouch(isOnTop) {
    this._emitter.emit('multi_touch', { isOnTop });
  }

  /*
   * It handles the native "touchstart" rather than the React's "onTouchStart",
   *   because the "onTouchStart" does not have `event.changedTouches`.
   */
  _handleNativeCanvasTouchStart(event) {
    const nowTimestamp = new Date().getTime();

    // Suspend the drawing of the line
    this._beforeMatrix = null;

    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches.item(i);
      this._touchStartReceiver.addPoint(
        nowTimestamp,
        Math.round(touch.clientX),
        Math.round(touch.clientY)
      );
    }

    const activePointsData = this._touchStartReceiver.getActivePointsData(nowTimestamp);
    if (activePointsData.points.length >= 2) {
      const isOnTop = activePointsData.centerPoint.y < this.props.height / 2;
      this._emitMultiTouch(isOnTop);
    }
  }

  _handleCanvasTouchMove(event) {
    ignoreNativeUIEvents(event);

    const touch = event.changedTouches.item(0);

    const beforeMatrix = this._beforeMatrix;
    const currentMatrix = [
      Math.round(touch.clientX),
      Math.round(touch.clientY),
    ];

    if (beforeMatrix !== null) {
      if (this._config.pointerType === POINTER_TYPES.PEN) {
        this._canvasContext.globalCompositeOperation = 'source-over';
        this._canvasContext.lineWidth = this._config.penWidth;
        this._canvasContext.lineCap = 'round';
      } else {
        this._canvasContext.globalCompositeOperation = 'destination-out';
        this._canvasContext.lineWidth = this._config.eraserWidth;
        this._canvasContext.lineCap = 'butt';
      }
      this._canvasContext.beginPath();
      this._canvasContext.moveTo(beforeMatrix[0], beforeMatrix[1]);
      this._canvasContext.lineTo(currentMatrix[0], currentMatrix[1]);
      this._canvasContext.stroke();
    }

    this._beforeMatrix = currentMatrix;
  }

  _handleCanvasTouchEnd(event) {
    const el = ReactDOM.findDOMNode(this);

    // Check the "onTouchMove" emission
    if (this._beforeMatrix !== null) {
      this._editHistory.add(el.toDataURL());
    }
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);

    this._canvasContext = el.getContext('2d');

    el.addEventListener('touchstart', this._handleNativeCanvasTouchStart.bind(this));

    el.emitter = this._emitter;
  }

  render() {
    return (
      <canvas
        className="canvas-board js-canvas-board"
        width={ this.props.width }
        height={ this.props.height }
        onClick={ ignoreNativeUIEvents.bind(this) }
        onMouseDown={ ignoreNativeUIEvents.bind(this) }
        onTouchMove={ this._handleCanvasTouchMove.bind(this) }
        onTouchEnd={ this._handleCanvasTouchEnd.bind(this) }
      />
    );
  }
}

Object.assign(CanvasBoard, {
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  },
});
