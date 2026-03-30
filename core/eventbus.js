// SpottyFire EventBus — Central pub/sub for all inter-module communication
const EventBus = (() => {
  const listeners = new Map();

  function on(event, callback) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(callback);
    return () => off(event, callback);
  }

  function off(event, callback) {
    const cbs = listeners.get(event);
    if (cbs) cbs.delete(callback);
  }

  function emit(event, payload) {
    const cbs = listeners.get(event);
    if (cbs) cbs.forEach(cb => cb(payload));
  }

  function once(event, callback) {
    const wrapper = (payload) => {
      off(event, wrapper);
      callback(payload);
    };
    on(event, wrapper);
  }

  return { on, off, emit, once };
})();

// Event type constants
const SF_EVENTS = {
  DATA_LOADED: 'DATA_LOADED',
  MARKING_CHANGED: 'MARKING_CHANGED',
  MARKING_CLEARED: 'MARKING_CLEARED',
  FILTER_CHANGED: 'FILTER_CHANGED',
  FILTER_RESET: 'FILTER_RESET',
  CONFIG_CHANGED: 'CONFIG_CHANGED',
  PANEL_RESIZED: 'PANEL_RESIZED',
  HOVER: 'HOVER',
};
