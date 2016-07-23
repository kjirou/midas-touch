export const ignoreNativeUIEvents = (event) => {
  event.stopPropagation();
  event.preventDefault();
};

export const cloneViaJson = (any) => {
  return JSON.parse(JSON.stringify(any));
};
