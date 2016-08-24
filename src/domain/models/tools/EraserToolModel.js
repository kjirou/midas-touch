import { TOOL_IDS } from '../../../consts';
import ToolModel from './ToolModel';


export default class EraserToolModel extends ToolModel {
  constructor() {
    super();

    this._toolId = TOOL_IDS.ERASER;
    this._iconId = 'stop';
    this._label = 'Eraser';
  }
}
