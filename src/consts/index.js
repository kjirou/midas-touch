export const _objectFromKeys = (keys) => {
  const dict = {};
  keys.forEach(key => dict[key] = key);
  return dict;
};


export const PAGE_IDS = _objectFromKeys([
  'CANVAS',
  'WELCOME',
]);

export const POINTER_TYPES = _objectFromKeys([
  'ERASER',
  'PEN',
]);

export const STATE_EVENTS = _objectFromKeys([
  'CHANGE',
]);

// Should sync to stylesheets
export const STYLES = {
};
