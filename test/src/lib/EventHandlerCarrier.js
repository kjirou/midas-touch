import assert from 'power-assert';
import React from 'react';

import EventHandlerCarrier from 'src/lib/EventHandlerCarrier';


describe('src/lib/EventHandlerCarrier', () => {
  it('should check the element\'s type', () => {
    class Foo extends React.Component {}
    class Bar extends Foo {}
    class Baz extends React.Component {}

    const carrierForComponent = new EventHandlerCarrier(() => {});
    const carrierForFoo = new EventHandlerCarrier(() => {}, Foo);
    const carrierForBar = new EventHandlerCarrier(() => {}, Bar);
    const carrierForBaz = new EventHandlerCarrier(() => {}, Baz);

    const foo = new Foo();
    const bar = new Bar();
    const baz = new Baz();

    carrierForComponent.bindContexts(foo);
    carrierForComponent.bindContexts(bar);
    carrierForComponent.bindContexts(baz);

    carrierForFoo.bindContexts(foo);
    carrierForFoo.bindContexts(bar);
    assert.throws(() => {
      carrierForFoo.bindContexts(baz);
    }, /Baz/);

    assert.throws(() => {
      carrierForBar.bindContexts(foo);
    }, /Foo/);
    carrierForBar.bindContexts(bar);
    assert.throws(() => {
      carrierForBar.bindContexts(baz);
    }, /Baz/);

    assert.throws(() => {
      carrierForBaz.bindContexts(foo);
    }, /Foo/);
    assert.throws(() => {
      carrierForBaz.bindContexts(bar);
    }, /Bar/);
    carrierForBaz.bindContexts(baz);
  });

  it('should be', () => {
    class Foo extends React.Component {
      getX() {
        return 5;
      }
    }

    const carrier = new EventHandlerCarrier((arg1, arg2, event, element) => {
      return [arg1, arg2, event.keyCode, element.getX()];
    }, Foo);

    const foo = new Foo();

    const boundHandler = carrier.bindContexts(foo, 2, 4);

    const actual = boundHandler({ keyCode: 1 });

    assert.deepEqual(actual, [
      2,
      4,
      1,
      5,
    ]);
  });
});
