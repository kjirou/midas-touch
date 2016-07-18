const MULTIPLE_TOUCH_RECEIVABLE_INTERVAL = 50;

/*
 * Original multiple touch point receiver
 */
export default class TouchStartReceiver {
  constructor() {
    /*
     * Points of "touchstart" events
     * {object[]} - Ref #add
     */
    this._points = [];
  }

  /*
   * @param {number} timestamp
   * @param {number} x - A relative distance from the canvas x(=left)
   * @param {number} y - A relative distance from the canvas y(=top)
   */
  addPoint(timestamp, x, y) {
    this._points.push({
      timestamp,
      x,
      y,
    });
  }

  _filterToActivePoints(nowTimestamp, receivableInterval) {
    return this._points.filter(pointData => {
      return pointData.timestamp >= nowTimestamp - receivableInterval;
    });
  }

  _calculateCenterPoint(points) {
    const point = {
      x: 0,
      y: 0,
    };

    if (points.length === 0) {
      return point;
    }

    let totalX = 0;
    let totalY = 0;
    points.forEach(point => {
      totalX += point.x;
      totalY += point.y;
    });

    point.x = Math.round(totalX / points.length);
    point.y = Math.round(totalY / points.length);

    return point;
  }

  /*
   * Return active points with computed data
   * @param {number} nowTimestamp
   */
  getActivePointsData(nowTimestamp) {
    const activePoints = this._filterToActivePoints(nowTimestamp, MULTIPLE_TOUCH_RECEIVABLE_INTERVAL);
    return {
      points: activePoints,
      centerPoint: this._calculateCenterPoint(activePoints),
    };
  }
}
