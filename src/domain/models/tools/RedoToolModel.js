import { TOOL_IDS } from '../../../consts';
import ToolModel from './ToolModel';


export default class RedoToolModel extends ToolModel {
  constructor() {
    super();

    this._toolId = TOOL_IDS.REDO;
    this._iconId = 'fast_forward';
    this._label = 'Redo';
  }
}
