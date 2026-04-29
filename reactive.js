class EventEmitter {
  constructor() {
    this.listeners = {}; 
  }
 
  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }
 
  off(event, fn) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== fn);
  }
 
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(fn => fn(data));
  }
}

class Observable {
  constructor(emitter, event) {
    this.emitter = emitter;
    this.event = event;
  }
 
  subscribe(fn) {
    this.emitter.on(this.event, fn);
    return () => this.emitter.off(this.event, fn); 
  }
}

const emitter = new EventEmitter();

const logger = data => console.log(`Logger get: "${data}"`);
const notifier = data => console.log(`Notify notification: "${data}"`);
 
emitter.on('message', logger);
emitter.on('message', notifier);
 
console.log("Emit 1: ");
emitter.emit('message', 'Hi!');
 
emitter.off('message', logger);
 
console.log("Emit 2: ");
emitter.emit('message', 'Second message');
 
const obs = new Observable(emitter, 'message');
const unsubscribe = obs.subscribe(d => console.log(`Obs get: "${d}"`));
 
emitter.emit('message', 'observable');
unsubscribe();
emitter.emit('message', 'after unsubscribe');
console.log("Obs no messages");