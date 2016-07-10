import React from 'react';

import pages from './pages';


export default class Root extends React.Component {

  _getCurrentPageComponent() {
    return pages[this.props.pageId];
  }

  render() {
    const page = React.createElement(this._getCurrentPageComponent(), {
      key: `page-${ this.props.pageId }`,
      root: this.props,
      page: {},
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
