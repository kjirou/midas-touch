import { objectFromKeys } from '@kjirou/utils';


export const PAGE_IDS = objectFromKeys([
  'CANVAS',
  'WELCOME',
]);

export const POINTER_TYPES = objectFromKeys([
  'ERASER',
  'PEN',
]);

export const STATE_EVENTS = objectFromKeys([
  'CHANGE',
]);

// Should sync to stylesheets
export const STYLES = {
};

export const TOOL_IDS = objectFromKeys([
  'ERASER',
  'PEN',
  'REDO',
  'UNDO',
]);
