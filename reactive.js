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
    if (event === 'error' && !this.listeners['error']) {
      throw data instanceof Error ? data : new Error(String(data));
    }

    if (!this.listeners[event]) return;

    this.listeners[event].forEach(fn => {
      try {
        fn(data);
      } catch (err) {
        this.emit('error', err);
      }
    });
  }
}

class Observable {
  constructor(emitter, event) {
    this.emitter = emitter;
    this.event   = event;
  }

  subscribe(fn) {
    this.emitter.on(this.event, fn);
    return () => this.emitter.off(this.event, fn); 
  }
}

const emitter = new EventEmitter();
emitter.on('error', err => console.error(`[Error]   ${err.message}`));

const logger = data => console.log(`[Logger]  отримав: "${data}"`);
const notifier = data => console.log(`[Notify]  сповіщення: "${data}"`);
const broken = () => { throw new Error('listener впав!'); };

emitter.on('message', logger);
emitter.on('message', broken);  
emitter.on('message', notifier);

console.log("Emit 1: broken don't stop notifier");
emitter.emit('message', 'Привіт!');

emitter.off('message', logger);
emitter.off('message', broken);

console.log("\n only notifier ");
emitter.emit('message', 'Другий меседж');

console.log("\n=== Observable + subscribe/unsubscribe ===");
const obs         = new Observable(emitter, 'message');
const unsubscribe = obs.subscribe(d => console.log(`[Obs]     отримав: "${d}"`));

emitter.emit('message', 'Через observable');
unsubscribe();
emitter.emit('message', 'Після unsubscribe — не побачить');
console.log("[Obs] більше не отримує повідомлень");

console.log("\nError without listener");
const bare = new EventEmitter();
try {
  bare.emit('error', new Error('необроблена помилка'));
} catch (e) {
  console.log(`[Caught]  ${e.message}`);
}