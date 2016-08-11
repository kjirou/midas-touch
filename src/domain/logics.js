/*
 * Business logics
 *
 * Generally each logic becomes one-to-one with the UI, but not necessarily.
 * For example, sometimes one of the logic is used for plural UIs.
 *
 * Therefore, as the business logic name, you can use both terms of the Model and terms of the UI.
 * e.g.
 *   Model terms = createFoo, updateFoo, obtainFoo, etc
 *   UI terms    = touchFoo, scrollFoo, checkFoo, etc
 */
const logics = {
  changePage({ model }, pageId) {
    model.pageId = pageId;
  },
};


export default logics;
