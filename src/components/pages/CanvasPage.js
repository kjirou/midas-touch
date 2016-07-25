import Baobab from 'baobab';
import React from 'react';
import ReactDOM from 'react-dom';

import { POINTER_TYPES } from '../../consts';
import EventHandlerCarrier from '../../lib/EventHandlerCarrier';
import { ignoreNativeUIEvents } from '../../lib/utils';
import CanvasBoard from '../CanvasBoard';
import Toolbox from '../Toolbox';
import PenTool from '../tools/PenTool';
import Page from './Page';


// TODO:
// - [bug] over redo
// - The Eraser button
// - Apply the Google's Icons to buttons
// - Make to slide-x tool buttons
// - Save to own device as the data-uri format
// - Save default width/height at first access
export default class CanvasPage extends Page {
  constructor() {
    super();

    this._canvasBoard = null;

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
            action: new EventHandlerCarrier(() => this._pointerToolboxButtonAction()),
          },
          {
            label: 'Pen',
            classList: [],
            action: new EventHandlerCarrier(() => this._penToolboxButtonAction()),
          },
          {
            label: 'Undo',
            classList: [],
            action: new EventHandlerCarrier(() => this._undoToolboxButtonAction()),
          },
          {
            label: 'Redo',
            classList: [],
            action: new EventHandlerCarrier(() => this._redoToolboxButtonAction()),
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

          plusAction: new EventHandlerCarrier(() => this._penToolPlusButtonAction()),
          minusAction: new EventHandlerCarrier(() => this._penToolMinusButtonAction()),
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

  _findCanvasBoardContainerNode() {
    const node =  ReactDOM.findDOMNode(this);
    return node.querySelector('.js-canvas-page__canvas-board-container');
  }

  _findCanvasBoardNode() {
    const node =  this._findCanvasBoardContainerNode();
    return node.querySelector('.js-canvas-board');
  }

  _cyclePointerType() {
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
  }

  _toggleToolbox(isOnTop) {
    const cursor = this._stateTree.select(['toolbox']);

    if (cursor.get('isShowing')) {
      cursor.set('isShowing', false);
    } else {
      cursor.set('isShowing', true);
      cursor.set('isOnTop', isOnTop);
    }
  }

  _togglePenTool() {
    const cursor = this._stateTree.select(['tools', 'pen']);

    if (cursor.get('isShowing')) {
      cursor.set('isShowing', false);
    } else {
      cursor.set('isShowing', true);
    }
  }

  _setPenWidth(value) {
    const limitedValue = Math.min(Math.max(value, 1), 15);
    this._stateTree.set(['tools', 'pen', 'penWidth'], limitedValue);
  }

  _alterPenWidth(delta) {
    const nextPenWidth = this._stateTree.get(['tools', 'pen', 'penWidth']) + delta;
    this._setPenWidth(nextPenWidth);
  }


  //
  // Actions
  //
  // Mini flux cycle entry points
  //

  _toggleToolboxAction(isOnTop) {
    this._toggleToolbox(isOnTop);
    this._syncState();
  }

  _pointerToolboxButtonAction() {
    this._cyclePointerType();
    this._syncState();
  }

  _penToolboxButtonAction() {
    this._togglePenTool();
    this._syncState();
  }

  _undoToolboxButtonAction() {
    this._findCanvasBoardNode().emitter.emit('undo');
  }

  _redoToolboxButtonAction() {
    this._findCanvasBoardNode().emitter.emit('redo');
  }

  _penToolPlusButtonAction() {
    this._alterPenWidth(2);
    this._findCanvasBoardNode().emitter.emit('config', {
      penWidth: this._stateTree.get(['tools', 'pen', 'penWidth']),
    });
    this._syncState();
  }

  _penToolMinusButtonAction() {
    this._alterPenWidth(-2);
    this._findCanvasBoardNode().emitter.emit('config', {
      penWidth: this._stateTree.get(['tools', 'pen', 'penWidth']),
    });
    this._syncState();
  }


  //
  // DOM Event Handlers
  //

  _handleNativeWindowKeyDown(event) {
    const shift = event.shiftKey;
    const ctrl = event.ctrlKey || event.metaKey;

    switch (event.keyCode) {
      case 67:  // "c"
        this._findCanvasBoardNode().emitter.emit('clear');
        break;
      case 68:  // "d"
        console.log(this);
        break;
      case 82:  // "r"
        this._redoToolboxButtonAction();
        break;
      case 84:  // "t"
        if (shift) {
          this._toggleToolboxAction(true);
        } else {
          this._toggleToolboxAction(false);
        }
        break;
      case 85:  // "u"
        this._undoToolboxButtonAction();
        break;
    }
  }


  //
  // React Lifecycle
  //

  componentDidMount() {
    window.addEventListener('keydown', this._handleBoundNativeWindowKeyDown);

    this._canvasBoard = <CanvasBoard
      width={ this.props.root.screenSize.width }
      height={ this.props.root.screenSize.height }
    />;
    ReactDOM.render(this._canvasBoard, this._findCanvasBoardContainerNode());
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleBoundNativeWindowKeyDown);

    ReactDOM.unmountComponentAtNode(this._findCanvasBoardContainerNode());
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
        <div className="canvas-page__canvas-board-container js-canvas-page__canvas-board-container" />
        { toolbox }
        { penTool }
      </div>
    );
  }
}
