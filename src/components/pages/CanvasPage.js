import Baobab from 'baobab';
import React from 'react';
import ReactDOM from 'react-dom';

import { POINTER_TYPES } from '../../consts';
import EditHistory from '../../lib/EditHistory';
import EventHandlerCarrier from '../../lib/EventHandlerCarrier';
import TouchStartReceiver from '../../lib/TouchStartReceiver';
import { ignoreNativeUIEvents } from '../../lib/utils';
import Toolbox from '../Toolbox';
import PenTool from '../tools/PenTool';
import Page from './Page';


// TODO:
// - The Eraser button
// - Apply the Google's Icons to buttons
// - Make to slide-x tool buttons
// - Save to own device as the data-uri format
// - Save default width/height at first access
export default class CanvasPage extends Page {
  constructor() {
    super();

    this._canvasContext = null;

    /*
     * {(number[]|null)} - [x, y]
     */
    this._beforeMatrix = null;

    this._editHistory = new EditHistory();

    this._touchStartReceiver = new TouchStartReceiver();

    this._handleBoundNativeWindowKeyDown = this._handleNativeWindowKeyDown.bind(this);

    this._stateTree = new Baobab({
      pointer: {
        type: POINTER_TYPES.PEN,
      },
      toolbox: {
        isShowing: false,
        isOnTop: false,
        buttons: [
          {
            label: 'P',
            classList: [],
            action: new EventHandlerCarrier(() => this._togglePointerTypeAction()),
          },
          {
            label: 'Pen',
            classList: [],
            action: new EventHandlerCarrier(() => this._togglePenTool()),
          },
          {
            label: 'Undo',
            classList: [],
            action: new EventHandlerCarrier(() => this._undo()),
          },
          {
            label: 'Redo',
            classList: [],
            action: new EventHandlerCarrier(() => this._redo()),
          },
        ],
      },
      tools: {
        pen: {
          isShowing: false,

          /*
           * @param {number} - A integer >= 1
           */
          penWidth: 1,

          plusAction: new EventHandlerCarrier(() => this._alterPenWidth(2)),
          minusAction: new EventHandlerCarrier(() => this._alterPenWidth(-2)),
        },
      },
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

  /*
   * TODO: This async processing is not managed
   * @return {Promise}
   */
  _restoreImageFromDataUri(dataUri) {
    const { width, height } = this.props.root.screenSize;
    const image = new Image(width, height);

    return new Promise((resolve) => {
      image.src = dataUri;
      // This `onload` should be use at least for the Moblie Safari
      image.onload = () => {
        this._clearCanvas();
        this._canvasContext.drawImage(image, 0, 0, width, height);
        resolve();
      }
    });
  }

  _togglePointerTypeAction() {
    const pointerCursor = this._stateTree.select('pointer');

    const nextPointerType = {
      [POINTER_TYPES.PEN]: POINTER_TYPES.ERASER,
      [POINTER_TYPES.ERASER]: POINTER_TYPES.PEN,
    }[pointerCursor.get('type')];

    pointerCursor.set('type', nextPointerType);

    const label = {
      [POINTER_TYPES.PEN]: 'P',
      [POINTER_TYPES.ERASER]: 'E',
    }[nextPointerType];

    this._stateTree.set(['toolbox', 'buttons', '0', 'label'], label);

    this._syncState();
  }

  _undo() {
    const dataUri = this._editHistory.undo();

    if (dataUri) {
      this._restoreImageFromDataUri(dataUri);
    } else {
      this._clearCanvas();
    }
  }

  _redo() {
    const dataUri = this._editHistory.redo();

    if (dataUri) {
      this._restoreImageFromDataUri(dataUri);
    } else {
      this._clearCanvas();
    }
  }

  _toggleToolbox(isOnTop) {
    const cursor = this._stateTree.select(['toolbox']);

    if (cursor.get('isShowing')) {
      cursor.set('isShowing', false);
    } else {
      cursor.set('isShowing', true);
      cursor.set('isOnTop', isOnTop);
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

  _setPenWidth(value) {
    const limitedValue = Math.min(Math.max(value, 1), 15);
    this._stateTree.set(['tools', 'pen', 'penWidth'], limitedValue);
    this._syncState();
  }

  _alterPenWidth(delta) {
    const nextPenWidth = this._stateTree.get(['tools', 'pen', 'penWidth']) + delta;
    this._setPenWidth(nextPenWidth);
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

    // Check the "onTouchMove" emission
    if (this._beforeMatrix !== null) {
      this._editHistory.add(canvas.toDataURL());
    }
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
      const isOnTop = activePointsData.centerPoint.y < this.props.root.screenSize.height / 2;
      this._toggleToolbox(isOnTop);
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
          this._toggleToolbox(true);
        } else {
          this._toggleToolbox(false);
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
    const createToolbox = (state) => {
      return <Toolbox
        isOnTop={ state.toolbox.isOnTop }
        buttons={ state.toolbox.buttons }
      />;
    }

    const createPenTool = (state) => {
      return <PenTool {
        ...Object.assign({}, state.tools.pen, {
          isOnTop: state.toolbox.isOnTop,
        })
      }/>
    }


    const toolbox = this.state.toolbox.isShowing ? createToolbox(this.state) : null;
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
        { toolbox }
        { penTool }
      </div>
    );
  }
}
