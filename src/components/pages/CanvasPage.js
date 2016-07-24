import Baobab from 'baobab';
import React from 'react';
import ReactDOM from 'react-dom';

import EditHistory from '../../lib/EditHistory';
import EventHandlerCarrier from '../../lib/EventHandlerCarrier';
import TouchStartReceiver from '../../lib/TouchStartReceiver';
import { cloneViaJson, ignoreNativeUIEvents } from '../../lib/utils';
import ControlPanel from '../ControlPanel';
import PenTool from '../tools/PenTool';
import Page from './Page';


// TODO:
// - Tools system
// - The Pen button
// - The Eraser button
// - Apply the Google's Icons to buttons
// - Adjust to the center of lineWidth
// - Save to own device as the data-uri format
// - Save default width/height at first access
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

    this._handleBoundNativeWindowKeyDown = this._handleNativeWindowKeyDown.bind(this);

    this._stateTree = new Baobab({
      buttons: [
        {
          label: 'Undo',
          classList: [''],
          carrier: new EventHandlerCarrier(() => {
            this._undo();
          }, ControlPanel),
        },
        {
          label: 'Redo',
          classList: [''],
          carrier: new EventHandlerCarrier(() => {
            this._redo();
          }, ControlPanel),
        },
        {
          label: 'Pen',
          classList: ['js-pen-button'],
          carrier: new EventHandlerCarrier(() => {
            this._togglePenTool();
          }, ControlPanel),
        },
      ],
      tools: {
        pen: {
          isShowing: false,

          /*
           * @param {number} - A integer >= 1
           */
          penWidth: 1,
        },
      },
      isControlPanelOpened: true,
      //isControlPanelOpened: false,
      isControlPanelPlacedOnTop: false,
    });

    this.state = this._generateState();
  }

  _generateState() {
    const state = this._stateTree.get();

    return state;
  }

  _syncState() {
    this.setState(this._generateState());
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

  _toggleControlPanel(isPlacedOnTop) {
    if (this._stateTree.get('isControlPanelOpened')) {
      this._stateTree.set('isControlPanelOpened', false);
    } else {
      this._stateTree.set('isControlPanelOpened', true);
      this._stateTree.set('isControlPanelPlacedOnTop', isPlacedOnTop);
    }
    this._syncState();
  }

  _togglePenTool() {
    const cursor = this._stateTree.select(['tools', 'pen']);
    if (cursor.get('isShowing')) {
      cursor.set('isShowing', false);
    } else {
      cursor.set('isShowing', true);
    }
    this._syncState();
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
      this._canvasContext.lineWidth = this._stateTree.get(['tools', 'pen', 'penWidth']);
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
    const shift = event.shiftKey;
    const ctrl = event.ctrlKey || event.metaKey;

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
        if (shift) {
          this._toggleControlPanel(true);
        } else {
          this._toggleControlPanel(false);
        }
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
    const createControlPanel = (state) => {
      return <ControlPanel
        isPlacedOnTop={ state.isControlPanelPlacedOnTop }
        buttons={ state.buttons }
      />;
    }

    const createPenTool = (state) => {
      return <PenTool
        isOnTop={ state.isControlPanelPlacedOnTop }
        penWidth={ state.tools.pen.penWidth }
      />;
    }


    const controlPanel = this.state.isControlPanelOpened ? createControlPanel(this.state) : null;
    const penTool = this.state.tools.pen.isShowing ? createPenTool(this.state) : null;

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
        { penTool }
      </div>
    );
  }
}
