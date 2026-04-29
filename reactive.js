class EventEmitter {
  constructor() {
    this.listeners = {}; // { eventName: [fn1, fn2, ...] }
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
