import { TOOL_IDS } from '../../../consts';
import ToolModel from './ToolModel';


export default class PenToolModel extends ToolModel {
  constructor() {
    super();

    this._toolId = TOOL_IDS.PEN;
    this._iconId = 'brush';
    this._label = 'Pen';
  }
}
