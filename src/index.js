import getViewportSize from 'get-viewport-size';
import ReactDOM from 'react-dom';

import App from './App';
import { PAGE_IDS } from './consts';


// TODO:
// - Test
//   - Run on the CI
//   - App.js tests
// - Screen rotation
// - Save to own device as the data-uri format
// - Save default width/height at first access
window.document.addEventListener('DOMContentLoaded', () => {
  //console.log('standalone:', window.navigator.standalone);
  const viewportSize = getViewportSize();

  const app = new App({
    screenSize: [viewportSize.width, viewportSize.height],
  });

  const container = window.document.querySelector('.js-mt-container');
  const root = app.createReactElement();

  ReactDOM.render(root, container, () => {
    console.log(`Start the app at ${ new Date() }`);
  });
});
