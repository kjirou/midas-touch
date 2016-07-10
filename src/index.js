import getViewportSize from 'get-viewport-size';
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/Root';
import { PAGE_IDS } from './consts';


window.document.addEventListener('DOMContentLoaded', () => {
  const viewportSize = getViewportSize();

  const root = React.createElement(Root, {
    pageId: PAGE_IDS.CANVAS,
    screenSize: {
      width: viewportSize.width,
      height: viewportSize.height,
    },
  });
  const container = window.document.querySelector('.js-mt-container');
  ReactDOM.render(root, container);
});
