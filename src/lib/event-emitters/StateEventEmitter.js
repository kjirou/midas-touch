import { EventEmitter } from 'events';


export default class StateEventEmitter extends EventEmitter {
  emit(...args) {
    console.log('state:', ...args.slice(1));
    EventEmitter.prototype.emit.apply(this, args);
  }
}
