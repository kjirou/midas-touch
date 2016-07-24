export const ignoreNativeUIEvents = (event) => {
  event.stopPropagation();
  event.preventDefault();
};

export const cloneViaJson = (any) => {
  return JSON.parse(JSON.stringify(any));
};

// WIP:
///*
// * Compute a absolute matrix
// *   by specifying the relative placement from the target element
// *
// * @param {object} containerRect - By getting the el.getBoundingClientRect()
// * @param {object} subjectRect
// * @param {object} targetRect
// * @param {object} options
// * @return {object} - A subject's matrix as a { top, left } according to `getBoundingClientRect`
// *                      that is adjusted to fall within the containerRect
// */
//export const computeMatrixByRelativePlacement = (containerRect, subjectRect, targetRect, options = {}) => {
//  const options_ = Object.assign({
//    // {string} - "left_end", "left_middle", "left_start", "middle", "right_start", "right_middle", "right_end"
//    horizontalLayout: 'middle',
//    // {string} - "top_end", "top_middle", "top_start", "middle", "bottom_start", "bottom_middle", "bottom_end"
//    verticalLayout: 'middle',
//  }, options);
//
//  const result = {
//    top: null,
//    left: null,
//  };
//
//  switch (options_.horizontalLayout) {
//    case 'middle':
//      break;
//  }
//
//  switch (options_.verticalLayout) {
//    case 'top_start':
//      break;
//  }
//
//  return result;
//};
