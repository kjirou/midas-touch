import Model from '../Model';


export default class ToolModel extends Model {
  constructor() {
    super();

    this._toolId = null;

    /*
     * {(string|null)} - A id of the Google's Material Design Icons
     *                   Ref) https://design.google.com/icons/
     */
    this._iconId = null;

    this._label = 'Unlabeled';
  }

  get toolId() { return this._toolId; }
  get iconId() { return this._iconId; }
  get label() { return this._label; }
}
