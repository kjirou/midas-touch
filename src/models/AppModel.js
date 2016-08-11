import { PAGE_IDS } from '../consts';
import Model from './Model';


export default class AppModel extends Model {
  constructor() {
    super();

    this._pageId = PAGE_IDS.CANVAS;
  }

  get pageId() { return this._pageId; }
  set pageId(value) { this._pageId = value; }
}
