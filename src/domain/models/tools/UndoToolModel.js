import { TOOL_IDS } from '../../../consts';
import ToolModel from './ToolModel';


export default class UndoToolModel extends ToolModel {
  constructor() {
    super();

    this._toolId = TOOL_IDS.UNDO;
    this._iconId = 'fast_rewind';
    this._label = 'Undo';
  }
}
