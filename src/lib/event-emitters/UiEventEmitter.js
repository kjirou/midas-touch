import { EventEmitter } from 'events';


export default class UiEventEmitter extends EventEmitter {
  emit(...args) {
    console.log('ui:', ...args);
    EventEmitter.prototype.emit.apply(this, args);
  }

  generateBoundEmitFunction() {
    return this.emit.bind(this);
  }
}
