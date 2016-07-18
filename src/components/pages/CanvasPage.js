import React from 'react';
import ReactDOM from 'react-dom';

import EditHistory from '../../lib/EditHistory';
import TouchStartReceiver from '../../lib/TouchStartReceiver';
import { ignoreNativeUIEvents } from '../../lib/utils';
import ControlPanel from '../ControlPanel';
import Page from './Page';


// TODO:
// - Adjust to the center of lineWidth
// - Save to own device as the data-uri format
// - (give up) Does not draw unexpected dots at the time of "touchstart"
//   - It is a trade-off of the drawing response speed
export default class CanvasPage extends Page {

  constructor() {
    super();

    this._editHistory = new EditHistory();
    this._touchStartReceiver = new TouchStartReceiver();

    this._canvasContext = null;

    /*
     * {(number[]|null)} - [x, y]
     */
    this._beforeMatrix = null;

    this.state = {
      isControlPanelOpened: false,
      isControlPanelPlacedOnTop: false,
    };

    this._handleBoundNativeWindowKeyDown = this._handleNativeWindowKeyDown.bind(this);
  }

  static disableNativeEvent(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  _findCanvasNode() {
    return ReactDOM.findDOMNode(this).querySelector('.js-canvas-page__canvas');
  }

  _clearCanvas() {
    this._canvasContext.clearRect(0, 0,
      this.props.root.screenSize.width, this.props.root.screenSize.height);
  }

  _drawImageFromDataUri(dataUri) {
    const { width, height } = this.props.root.screenSize;
    const image = new Image(width, height);
    image.src = dataUri;
    this._canvasContext.drawImage(image, 0, 0, width, height);
  }

  _openControlPanel(isPlacedOnTop) {
    this.setState({
      isControlPanelOpened: true,
      isControlPanelPlacedOnTop: isPlacedOnTop,
    });
  }

  _closeControlPanel() {
    this.setState({ isControlPanelOpened: false });
  }

  _toggleControlPanel(isPlacedOnTop) {
    if (this.state.isControlPanelOpened) {
      this._closeControlPanel();
    } else {
      this._openControlPanel(isPlacedOnTop);
    }
  }

  _undo() {
    this._clearCanvas();

    const dataUri = this._editHistory.undo();
    if (dataUri) {
      this._drawImageFromDataUri(dataUri);
    }
  }

  _redo() {
    const dataUri = this._editHistory.redo();

    if (dataUri) {
      this._clearCanvas();
      this._drawImageFromDataUri(dataUri);
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

    this._editHistory.add(canvas.toDataURL());
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
      const isPlacedOnTop = activePointsData.centerPoint.y < this.props.root.screenSize.height / 2;
      this._toggleControlPanel(isPlacedOnTop);
    }
  }

  _handleNativeWindowKeyDown(event) {
    switch (event.keyCode) {
      case 67:  // "c"
        this._clearCanvas();
        break;
      case 68:  // "d"
        console.log(this);
        break;
      case 82:  // "r"
        this._redo();
        break;
      case 84:  // "t"
        this._toggleControlPanel(false);
        break;
      case 85:  // "u"
        this._undo();
        break;
    }
  }

  componentDidMount() {
    const canvas = this._findCanvasNode();

    this._canvasContext = canvas.getContext('2d');

    canvas.addEventListener('touchstart', this._handleNativeCanvasTouchStart.bind(this));
    window.addEventListener('keydown', this._handleBoundNativeWindowKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleBoundNativeWindowKeyDown);
  }

  render() {
    const controlPanel = this.state.isControlPanelOpened ?
      <ControlPanel isPlacedOnTop={ this.state.isControlPanelPlacedOnTop } /> : null;

    return (
      <div
        className="canvas-page"
        onScroll={ ignoreNativeUIEvents.bind(this) }
        onWheel={ ignoreNativeUIEvents.bind(this) }
      >
        <canvas
          className="js-canvas-page__canvas"
          width={ this.props.root.screenSize.width }
          height={ this.props.root.screenSize.height }
          onClick={ ignoreNativeUIEvents.bind(this) }
          onMouseDown={ ignoreNativeUIEvents.bind(this) }
          onTouchMove={ this._handleCanvasTouchMove.bind(this) }
          onTouchEnd={ this._handleCanvasTouchEnd.bind(this) }
        />
        { controlPanel }
      </div>
    );
  }
}
