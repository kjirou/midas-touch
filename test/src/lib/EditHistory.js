import assert from 'power-assert';

import EditHistory from 'src/lib/EditHistory';


describe('src/lib/EditHistory', () => {

  it('_cutRecordsOfFeature', () => {
    const history = new EditHistory();

    history._records = ['a', 'b'];
    history._cursor = 0;
    assert.deepStrictEqual(history._cutRecordsOfFeature(), ['a']);

    history._records = ['a', 'b'];
    history._cursor = 1;
    assert.deepStrictEqual(history._cutRecordsOfFeature(), ['a', 'b']);

    history._records = ['a', 'b', 'c'];
    history._cursor = 1;
    assert.deepStrictEqual(history._cutRecordsOfFeature(), ['a', 'b']);

    history._records = ['a', 'b', 'c'];
    history._cursor = 2;
    assert.deepStrictEqual(history._cutRecordsOfFeature(), ['a', 'b', 'c']);
  });

  it('add', () => {
    const history = new EditHistory();
    assert.deepStrictEqual(history._records, []);
    assert.deepStrictEqual(history._cursor, -1);

    history.add('a');
    assert.deepStrictEqual(history._records, ['a']);
    assert.deepStrictEqual(history._cursor, 0);

    history.add('b');
    assert.deepStrictEqual(history._records, ['a', 'b']);
    assert.deepStrictEqual(history._cursor, 1);
  });

  it('the max record count should be 20', () => {
    const history = new EditHistory();

    Array.from({ length: 20 }).forEach((notUsed, i) => {
      history.add(String(i));
    });

    assert.deepStrictEqual(history._records, [
      '0', '1', '2', '3', '4',
      '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14',
      '15', '16', '17', '18', '19',
    ]);
    assert.deepStrictEqual(history._cursor, 19);

    history.add('20');
    assert.deepStrictEqual(history._records, [
      '1', '2', '3', '4',
      '5', '6', '7', '8', '9',
      '10', '11', '12', '13', '14',
      '15', '16', '17', '18', '19',
      '20',
    ]);
    assert.deepStrictEqual(history._cursor, 19);
  });

  it('undo', () => {
    const history = new EditHistory();

    history.add('a');
    history.add('b');
    assert.deepStrictEqual(history._records, ['a', 'b']);
    assert.deepStrictEqual(history._cursor, 1);

    let result;

    result = history.undo();
    assert.deepStrictEqual(result, 'a');
    assert.deepStrictEqual(history._records, ['a', 'b']);
    assert.deepStrictEqual(history._cursor, 0);

    result = history.undo();
    assert.deepStrictEqual(result, null);
    assert.deepStrictEqual(history._records, ['a', 'b']);
    assert.deepStrictEqual(history._cursor, -1);

    result = history.undo();
    assert.deepStrictEqual(result, null);
    assert.deepStrictEqual(history._cursor, -1);
  });

  it('redo', () => {
    const history = new EditHistory();

    history.add('a');
    history.add('b');
    history.add('c');

    history.undo();
    history.undo();
    assert.deepStrictEqual(history._records, ['a', 'b', 'c']);
    assert.deepStrictEqual(history._cursor, 0);

    let result;

    result = history.redo();
    assert.deepStrictEqual(result, 'b');
    assert.deepStrictEqual(history._records, ['a', 'b', 'c']);
    assert.deepStrictEqual(history._cursor, 1);

    result = history.redo();
    assert.deepStrictEqual(result, 'c');
    assert.deepStrictEqual(history._records, ['a', 'b', 'c']);
    assert.deepStrictEqual(history._cursor, 2);

    result = history.redo();
    assert.deepStrictEqual(result, null);
    assert.deepStrictEqual(history._cursor, 2);
  });
});
