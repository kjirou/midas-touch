import assert from 'power-assert';

import TouchStartReceiver from 'src/lib/TouchStartReceiver';


describe('src/lib/TouchStartReceiver', () => {
  it('addPoint', () => {
    const receiver = new TouchStartReceiver();
    assert.deepStrictEqual(receiver._points, []);

    receiver.addPoint(1460000000000, 10, 50);
    assert.deepStrictEqual(receiver._points, [
      {
        timestamp: 1460000000000,
        x: 10,
        y: 50,
      },
    ]);

    receiver.addPoint(1460000000001, 11, 51);
    assert.deepStrictEqual(receiver._points, [
      {
        timestamp: 1460000000000,
        x: 10,
        y: 50,
      },
      {
        timestamp: 1460000000001,
        x: 11,
        y: 51,
      },
    ]);
  });

  it('_filterToActivePoints', () => {
    const receiver = new TouchStartReceiver();

    assert.deepStrictEqual(receiver._filterToActivePoints(1460000000000, 50), []);

    receiver.addPoint(1460000000001, 101, 201);
    receiver.addPoint(1460000000002, 102, 202);
    receiver.addPoint(1460000000003, 103, 203);

    assert.deepStrictEqual(receiver._filterToActivePoints(1460000000051, 50), [
      {
        x: 101,
        y: 201,
        timestamp: 1460000000001,
      },
      {
        x: 102,
        y: 202,
        timestamp: 1460000000002,
      },
      {
        x: 103,
        y: 203,
        timestamp: 1460000000003,
      },
    ]);

    assert.deepStrictEqual(receiver._filterToActivePoints(1460000000052, 50), [
      {
        x: 102,
        y: 202,
        timestamp: 1460000000002,
      },
      {
        x: 103,
        y: 203,
        timestamp: 1460000000003,
      },
    ]);
  });

  it('_calculateCenterPoint', () => {
    const receiver = new TouchStartReceiver();
    let result;

    result = receiver._calculateCenterPoint([]);
    assert.deepStrictEqual({
      x: 0,
      y: 0,
    }, result);

    result = receiver._calculateCenterPoint([
      {
        x: 50,
        y: 100,
      },
    ]);
    assert.deepStrictEqual({
      x: 50,
      y: 100,
    }, result);

    result = receiver._calculateCenterPoint([
      {
        x: 50,
        y: 100,
      },
      {
        x: 10,
        y: 20,
      },
    ]);
    assert.deepStrictEqual({
      x: 30,
      y: 60,
    }, result);
  });

  it('getActivePointsData', () => {
    const receiver = new TouchStartReceiver();
    let result;

    result = receiver.getActivePointsData(1460000000000);
    assert.deepStrictEqual({
      points: [],
      centerPoint: {
        x: 0,
        y: 0,
      }
    }, result);

    receiver.addPoint(1460000000001, 1, 2);
    result = receiver.getActivePointsData(1460000000001);
    assert.deepStrictEqual({
      points: [
        {
          x: 1,
          y: 2,
          timestamp: 1460000000001,
        },
      ],
      centerPoint: {
        x: 1,
        y: 2,
      }
    }, result);
  });
});
