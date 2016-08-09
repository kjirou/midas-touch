import Baobab from 'baobab';
import React from 'react';
import ReactDOM from 'react-dom';

import { POINTER_TYPES } from '../../consts';
import EventHandlerCarrier from '../../lib/EventHandlerCarrier';
import { ignoreNativeUIEvents } from '../../lib/utils';
import CanvasBoard from '../CanvasBoard';
import Toolbox from '../Toolbox';
import SpinnerTool from '../tools/SpinnerTool';
import Page from './Page';


// TODO:
// - Apply flux
// - Save to own device as the data-uri format
// - Save default width/height at first access
export default class CanvasPage extends Page {
  constructor() {
    super();

    this._canvasBoard = null;

    this._handleBoundNativeWindowKeyDown = this._handleNativeWindowKeyDown.bind(this);
    this._handleBoundCanvasBoardMultiTouch = this._handleCanvasBoardMultiTouch.bind(this);

    this._stateTree = new Baobab({
      pointer: {
        type: POINTER_TYPES.PEN,
        /*
         * @param {number} - A integer >= 1
         */
        penWidth: 1,
        /*
         * @param {number} - A integer >= 1
         */
        eraserWidth: 5,
      },
      toolbox: {
        //isShowing: false,
        isShowing: true,
        isOnTop: false,
        //isOnTop: true,
        buttons: [
          {
            label: 'Pen',
            iconId: 'brush',
            classNames: ['is-active'],
            action: new EventHandlerCarrier(() => this._penToolboxButtonAction()),
          },
          {
            label: 'Eraser',
            iconId: 'stop',
            action: new EventHandlerCarrier(() => this._eraserToolboxButtonAction()),
          },
          {
            label: 'Undo',
            iconId: 'fast_rewind',
            action: new EventHandlerCarrier(() => this._undoToolboxButtonAction()),
          },
          {
            label: 'Redo',
            iconId: 'fast_forward',
            action: new EventHandlerCarrier(() => this._redoToolboxButtonAction()),
          },
          {
            label: 'Foo',
            action: new EventHandlerCarrier(() => null),
          },
          {
            label: 'Foo',
            action: new EventHandlerCarrier(() => null),
          },
          {
            label: 'Foo',
            action: new EventHandlerCarrier(() => null),
          },
        ],
      },
      tools: {
        pen: {
          isShowing: false,
          plusAction: new EventHandlerCarrier(() => this._penToolPlusButtonAction()),
          minusAction: new EventHandlerCarrier(() => this._penToolMinusButtonAction()),
        },
        eraser: {
          isShowing: false,
          plusAction: new EventHandlerCarrier(() => this._eraserToolPlusButtonAction()),
          minusAction: new EventHandlerCarrier(() => this._eraserToolMinusButtonAction()),
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

  _syncCanvasBoardConfig() {
    this._findCanvasBoardNode().emitter.emit('config', {
      pointerType: this._stateTree.get(['pointer', 'type']),
      penWidth: this._stateTree.get(['pointer', 'penWidth']),
      eraserWidth: this._stateTree.get(['pointer', 'eraserWidth']),
    });
  }

  _findCanvasBoardContainerNode() {
    const node =  ReactDOM.findDOMNode(this);
    return node.querySelector('.js-canvas-page__canvas-board-container');
  }

  _findCanvasBoardNode() {
    const node =  this._findCanvasBoardContainerNode();
    return node.querySelector('.js-canvas-board');
  }

  _changePointerType(pointerType) {
    const pointerCursor = this._stateTree.select('pointer');

    pointerCursor.set('type', pointerType);

    // Generate styles for each tool buttons
    // TODO: It is recursively in the _stateTree
    // TODO: Not considered to be reference to another state
    const toolboxCursor = this._stateTree.select('toolbox');
    toolboxCursor.get('buttons').forEach((button, index) => {
      // TODO: The labels are used as like a ID!
      const classNames = [];
      if (
        pointerType === POINTER_TYPES.PEN && button.label === 'Pen' ||
        pointerType === POINTER_TYPES.ERASER && button.label === 'Eraser'
      ) {
        classNames.push('is-active');
      }
      toolboxCursor.set(['buttons', String(index), 'classNames'], classNames);
    });
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

  _toggleEraserTool() {
    const cursor = this._stateTree.select(['tools', 'eraser']);

    if (cursor.get('isShowing')) {
      cursor.set('isShowing', false);
    } else {
      cursor.set('isShowing', true);
    }
  }

  _setPenWidth(value) {
    const limitedValue = Math.min(Math.max(value, 1), 25);
    this._stateTree.set(['pointer', 'penWidth'], limitedValue);
  }

  _alterPenWidth(delta) {
    const nextPenWidth = this._stateTree.get(['pointer', 'penWidth']) + delta;
    this._setPenWidth(nextPenWidth);
  }

  _setEraserWidth(value) {
    const limitedValue = Math.min(Math.max(value, 1), 25);
    this._stateTree.set(['pointer', 'eraserWidth'], limitedValue);
  }

  _alterEraserWidth(delta) {
    const nextPenWidth = this._stateTree.get(['pointer', 'eraserWidth']) + delta;
    this._setEraserWidth(nextPenWidth);
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

  _penToolboxButtonAction() {
    this._changePointerType(POINTER_TYPES.PEN);
    this._togglePenTool();
    this._syncCanvasBoardConfig();
    this._syncState();
  }

  _eraserToolboxButtonAction() {
    this._changePointerType(POINTER_TYPES.ERASER);
    this._toggleEraserTool();
    this._syncCanvasBoardConfig();
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
    this._syncCanvasBoardConfig();
    this._syncState();
  }

  _penToolMinusButtonAction() {
    this._alterPenWidth(-2);
    this._syncCanvasBoardConfig();
    this._syncState();
  }

  _eraserToolPlusButtonAction() {
    this._alterEraserWidth(4);
    this._syncCanvasBoardConfig();
    this._syncState();
  }

  _eraserToolMinusButtonAction() {
    this._alterEraserWidth(-4);
    this._syncCanvasBoardConfig();
    this._syncState();
  }


  //
  // DOM Event Handlers
  //

  _handleCanvasBoardMultiTouch({ isOnTop }) {
    this._toggleToolboxAction(isOnTop);
  }

  _handleNativeWindowKeyDown(event) {
    const shift = event.shiftKey;
    const ctrl = event.ctrlKey || event.metaKey;

    switch (event.keyCode) {
      case 67:  // "c"
        this._findCanvasBoardNode().emitter.emit('clear');
        break;
      case 68:  // "d"
        this._findCanvasBoardNode().emitter.emit('dump');
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

    const canvasBoardNode = this._findCanvasBoardNode();
    canvasBoardNode.emitter.on('multi_touch', this._handleBoundCanvasBoardMultiTouch);

    this._syncCanvasBoardConfig();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleBoundNativeWindowKeyDown);

    const canvasBoardNode = this._findCanvasBoardNode();
    canvasBoardNode.emitter.off('multi_touch', this._handleBoundCanvasBoardMultiTouch);

    ReactDOM.unmountComponentAtNode(this._findCanvasBoardContainerNode());
  }

  render() {
    const createToolbox = (state) => {
      return <Toolbox
        isOnTop={ state.toolbox.isOnTop }
        buttons={ state.toolbox.buttons }
      />;
    };

    const createPenTool = (state) => {
      return <SpinnerTool {
        ...Object.assign({}, state.tools.pen, {
          key: 'pen-tool',
          isOnTop: state.toolbox.isOnTop,
          value: state.pointer.penWidth,
        })
      }/>
    };

    const createEraserTool = (state) => {
      return <SpinnerTool {
        ...Object.assign({}, state.tools.eraser, {
          key: 'eraser-tool',
          isOnTop: state.toolbox.isOnTop,
          value: state.pointer.eraserWidth,
        })
      }/>
    };


    const toolbox = this.state.toolbox.isShowing ? createToolbox(this.state) : null;
    const penTool = this.state.tools.pen.isShowing ? createPenTool(this.state) : null;
    const eraserTool = this.state.tools.eraser.isShowing ? createEraserTool(this.state) : null;

    return (
      <div
        className="canvas-page"
        onScroll={ ignoreNativeUIEvents.bind(this) }
        onWheel={ ignoreNativeUIEvents.bind(this) }
      >
        <div className="canvas-page__canvas-board-container js-canvas-page__canvas-board-container" />
        { toolbox }
        { penTool }
        { eraserTool }
      </div>
    );
  }
}
