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

  it('add');

  it('undo');

  it('redo');
});
