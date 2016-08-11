import { EventEmitter } from 'events';
import React from 'react';

import { STATE_EVENTS } from '../consts';
import Root from './Root';


export default class RootProvider extends React.Component {
  getChildContext() {
    return {
      emit: this.props.uiEventEmitter.generateBoundEmitFunction(),
    };
  }

  componentDidMount() {
    this.props.stateEventEmitter.on(STATE_EVENTS.CHANGE, (state) => {
      this.setState(state);
    });
  }

  render() {
    if (this.state === null) {
      return <div>Now Loading..</div>;
    }

    return (
      <Root
        pageId={ this.state.pageId }
        screenSize={ this.state.screenSize }
      />
    );
  }
}

Object.assign(RootProvider, {
  childContextTypes: {
    emit: React.PropTypes.func.isRequired,
  },
  propTypes: {
    stateEventEmitter: React.PropTypes.instanceOf(EventEmitter),
    uiEventEmitter: React.PropTypes.instanceOf(EventEmitter),
  },
});
