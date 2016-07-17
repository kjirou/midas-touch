const MAX_RECORD_COUNT = 20;

export default class EditHistory {

  constructor() {
    /*
     * A canvas's transition that was saved as a list of the Data URI data
     * {string[]} - [dataUri0, dataUri1, ..]
     */
    this._records = [];

    /*
     * {number} - A integer & >= -1
     */
    this._cursor = -1;
  }

  /*
   * @return {string[]}
   */
  _cutRecordsOfFeature() {
    return this._records.slice(0, this._cursor + 1);
  }

  /*
   * @param {string} dataUri
   */
  add(dataUri) {
    let newRecords = this._cutRecordsOfFeature();

    newRecords.push(dataUri);

    newRecords = newRecords.slice(-MAX_RECORD_COUNT);

    this._records = newRecords;
    this._cursor = newRecords.length - 1;
  }

  /*
   * @return {(string|null)}
   */
  undo() {
    const previousCursor = this._cursor - 1;
    const dataUri = this._records[previousCursor] || null;

    if (previousCursor >= -1) {
      this._cursor = previousCursor;
    }

    return dataUri;
  }

  /*
   * @return {(string|null)}
   */
  redo() {
    const nextCursor = this._cursor + 1;
    const dataUri = this._records[nextCursor] || null;

    if (dataUri) {
      this._cursor = nextCursor;
    }

    return dataUri;
  }
}
