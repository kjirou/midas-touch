import getViewportSize from 'get-viewport-size';
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/Root';


window.document.addEventListener('DOMContentLoaded', () => {
  const viewportSize = getViewportSize();

  const container = window.document.querySelector('.js-mt-container');
  ReactDOM.render(React.createElement(Root, {
    screenSize: {
      width: viewportSize.width,
      height: viewportSize.height,
    },
  }), container);
});
