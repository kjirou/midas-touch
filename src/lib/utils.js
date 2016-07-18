export const ignoreNativeUIEvents = (event) => {
  event.stopPropagation();
  event.preventDefault();
};
