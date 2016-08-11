import { EventEmitter } from 'events';
import React from 'react';

import Root from './Root';


export default class RootProvider extends React.Component {
  getChildContext() {
    return {
      publish: this.props.publisher.publish.bind(this.props.publisher),
    };
  }

  render() {
    return (
      <Root
        pageId={ this.props.pageId }
        screenSize={ this.props.screenSize }
      />
    );
  }
}

Object.assign(RootProvider, {
  childContextTypes: {
    publish: React.PropTypes.func.isRequired,
  },
  propTypes: {
    pageId: React.PropTypes.string.isRequired,
    // TODO:
    //publisher: React.PropTypes.instanceOf(UIEventPublisher),
    screenSize: React.PropTypes.object.isRequired,
  },
});
