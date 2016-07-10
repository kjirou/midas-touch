import React from 'react';

import pages from './pages';


export default class Root extends React.Component {

  _getCurrentPage() {
    return pages['CANVAS'];
  }

  render() {
    const Page = this._getCurrentPage();
    const page = React.createElement(Page, {
      key: 'GAME',
      //key: this.props.pageId,
      root: this.props,
      //scene: this.props.scene,
    });

    const styles = {
      width: this.props.screenSize.width,
      height: this.props.screenSize.height,
    };

    return (
      <div className="root" style={ styles }>
        <div className="root__page-container">
          { page }
        </div>
      </div>
    );
  }
}

Object.assign(Root, {
  propTypes: {
    screenSize: React.PropTypes.object.isRequired,
  },
});
