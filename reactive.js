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
    const eventListeners = this.listeners[event];

    if (event === 'error' && (!eventListeners || eventListeners.length === 0)) {
      console.error('Uncaught error event:', data);
      return;
    }

    if (!eventListeners) return;

    eventListeners.forEach(fn => {
      try {
        fn(data);
      } catch (err) {
        if (event !== 'error') {
          this.emit('error', err);
        } else {
          console.error('Error in error listener:', err);
        }
      }
    });
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

emitter.on('message', (data) => {
  if (data === 'break') throw new Error('Error!');
  console.log(`Logger 1: ${data}`);
});

emitter.on('message', (data) => {
  console.log(`Logger 2: ${data}`);
});

console.log('Attempt 1: ');
emitter.emit('message', 'Привіт!');

console.log('\nAttempt 2: ');
emitter.emit('message', 'break'); 

