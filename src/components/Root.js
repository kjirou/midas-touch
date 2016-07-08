import React from 'react';

import pages from './pages';


export default class Root extends React.Component {

  _getCurrentPage() {
    return pages['GAME'];
    //return pages[this.props.pageId];
  }

  render() {
    const Page = this._getCurrentPage();
    const page = React.createElement(Page, {
      key: 'GAME',
      //key: this.props.pageId,
      root: this.props,
      //scene: this.props.scene,
    });

    return (
      <div className="root">
        <div className="root__page-container">
          Hello!
        </div>
      </div>
    );
  }
}
