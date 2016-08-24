import config from '../../config';
import { POINTER_TYPES, TOOL_IDS } from '../../consts';
import Model from './Model';
import EraserToolModel from './tools/EraserToolModel';
import PenToolModel from './tools/PenToolModel';
import RedoToolModel from './tools/RedoToolModel';
import UndoToolModel from './tools/UndoToolModel';


export default class CanvasModel extends Model {
  /*
   * @return {number} - A integer >= -1
   */
  static _findActiveToolIndexByPointerType(tools, pointerType) {
    const relatedClass = {
      PEN: PenToolModel,
      ERASER: EraserToolModel,
    }[pointerType] || null;

    let foundIndex = -1;
    tools.some((tool, index) => {
      if (tool instanceof relatedClass) {
        foundIndex = index;
        return true;
      }
    });
    return foundIndex;
  }

  constructor() {
    super();

    this._pointerType = POINTER_TYPES.PEN;

    /*
     * {number} - A integer >= 1
     */
    this._penWidth = 1;

    /*
     * {number} - A integer >= 1
     */
    this._eraserWidth = 5;

    this._tools = [
      new PenToolModel(),
      new EraserToolModel(),
      new UndoToolModel(),
      new RedoToolModel(),
    ];

    this._activeToolIndex =
      CanvasModel._findActiveToolIndexByPointerType(this._tools, this._pointerType);
  }

  _changePointerType(pointerType) {
    this._pointerType = pointerType;
    this._activeToolIndex = CanvasModel._findActiveToolIndexByPointerType(this._tools, this._pointerType);
  }
}


//  _toggleToolbox(isOnTop) {
//    const cursor = this._stateTree.select(['toolbox']);
//
//    if (cursor.get('isShowing')) {
//      cursor.set('isShowing', false);
//    } else {
//      cursor.set('isShowing', true);
//      cursor.set('isOnTop', isOnTop);
//    }
//  }
//
//  _togglePenTool() {
//    const cursor = this._stateTree.select(['tools', 'pen']);
//
//    if (cursor.get('isShowing')) {
//      cursor.set('isShowing', false);
//    } else {
//      cursor.set('isShowing', true);
//    }
//  }
//
//  _toggleEraserTool() {
//    const cursor = this._stateTree.select(['tools', 'eraser']);
//
//    if (cursor.get('isShowing')) {
//      cursor.set('isShowing', false);
//    } else {
//      cursor.set('isShowing', true);
//    }
//  }
//
//  _hideTools() {
//    ['pen', 'eraser'].forEach(relativePath => {
//      this._stateTree.set(['tools', relativePath, 'isShowing'], false);
//    });
//  }
//
//  _setPenWidth(value) {
//    const limitedValue = Math.min(Math.max(value, 1), 25);
//    this._stateTree.set(['pointer', 'penWidth'], limitedValue);
//  }
//
//  _alterPenWidth(delta) {
//    const nextPenWidth = this._stateTree.get(['pointer', 'penWidth']) + delta;
//    this._setPenWidth(nextPenWidth);
//  }
//
//  _setEraserWidth(value) {
//    const limitedValue = Math.min(Math.max(value, 1), 25);
//    this._stateTree.set(['pointer', 'eraserWidth'], limitedValue);
//  }
//
//  _alterEraserWidth(delta) {
//    const nextPenWidth = this._stateTree.get(['pointer', 'eraserWidth']) + delta;
//    this._setEraserWidth(nextPenWidth);
//  }
//
//
//  //
//  // Actions
//  //
//  // Mini flux cycle entry points
//  //
//
//  _toggleToolboxAction(isOnTop) {
//    this._toggleToolbox(isOnTop);
//    this._syncState();
//  }
//
//  _penToolboxButtonAction() {
//    const beforePointerType = this._stateTree.get(['pointer', 'type']);
//    const afterPointerType = POINTER_TYPES.PEN;
//
//    this._changePointerType(afterPointerType);
//
//    if (beforePointerType === afterPointerType) {
//      this._togglePenTool();
//    } else {
//      this._hideTools();
//    }
//
//    this._syncCanvasBoardConfig();
//    this._syncState();
//  }
//
//  _eraserToolboxButtonAction() {
//    const beforePointerType = this._stateTree.get(['pointer', 'type']);
//    const afterPointerType = POINTER_TYPES.ERASER;
//
//    this._changePointerType(afterPointerType);
//
//    if (beforePointerType === afterPointerType) {
//      this._toggleEraserTool();
//    } else {
//      this._hideTools();
//    }
//
//    this._syncCanvasBoardConfig();
//    this._syncState();
//  }
//
//  _undoToolboxButtonAction() {
//    this._findCanvasBoardNode().emitter.emit('undo');
//  }
//
//  _redoToolboxButtonAction() {
//    this._findCanvasBoardNode().emitter.emit('redo');
//  }
//
//  _penToolPlusButtonAction() {
//    this._alterPenWidth(2);
//    this._syncCanvasBoardConfig();
//    this._syncState();
//  }
//
//  _penToolMinusButtonAction() {
//    this._alterPenWidth(-2);
//    this._syncCanvasBoardConfig();
//    this._syncState();
//  }
//
//  _eraserToolPlusButtonAction() {
//    this._alterEraserWidth(4);
//    this._syncCanvasBoardConfig();
//    this._syncState();
//  }
//
//  _eraserToolMinusButtonAction() {
//    this._alterEraserWidth(-4);
//    this._syncCanvasBoardConfig();
//    this._syncState();
//  }
//
//
//  //
//  // DOM Event Handlers
//  //
//
//  _handleCanvasBoardMultiTouch({ isOnTop }) {
//    this._toggleToolboxAction(isOnTop);
//  }
//
//  _handleNativeWindowKeyDown(event) {
//    const shift = event.shiftKey;
//    const ctrl = event.ctrlKey || event.metaKey;
//
//    switch (event.keyCode) {
//      case 67:  // "c"
//        this._findCanvasBoardNode().emitter.emit('clear');
//        break;
//      case 68:  // "d"
//        this._findCanvasBoardNode().emitter.emit('dump');
//        console.log(this);
//        break;
//      case 82:  // "r"
//        this._redoToolboxButtonAction();
//        break;
//      case 84:  // "t"
//        if (shift) {
//          this._toggleToolboxAction(true);
//        } else {
//          this._toggleToolboxAction(false);
//        }
//        break;
//      case 85:  // "u"
//        this._undoToolboxButtonAction();
//        break;
//    }
//  }
//
//
//  //
//  // React Lifecycle
//  //
//
//  componentDidMount() {
//    window.addEventListener('keydown', this._handleBoundNativeWindowKeyDown);
//
//    this._canvasBoard = <CanvasBoard
//      width={ this.props.root.screenSize.width }
//      height={ this.props.root.screenSize.height }
//    />;
//    ReactDOM.render(this._canvasBoard, this._findCanvasBoardContainerNode());
//
//    const canvasBoardNode = this._findCanvasBoardNode();
//    canvasBoardNode.emitter.on('multi_touch', this._handleBoundCanvasBoardMultiTouch);
//
//    this._syncCanvasBoardConfig();
//  }
//
//  componentWillUnmount() {
//    window.removeEventListener('keydown', this._handleBoundNativeWindowKeyDown);
//
//    const canvasBoardNode = this._findCanvasBoardNode();
//    canvasBoardNode.emitter.off('multi_touch', this._handleBoundCanvasBoardMultiTouch);
//
//    ReactDOM.unmountComponentAtNode(this._findCanvasBoardContainerNode());
//  }
