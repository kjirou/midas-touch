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
    const state = this.state || this.props.initialState;

    return (
      <Root
        pageId={ state.pageId }
        screenSize={ state.screenSize }
      />
    );
  }
}

Object.assign(RootProvider, {
  childContextTypes: {
    emit: React.PropTypes.func.isRequired,
  },
  propTypes: {
    initialState: React.PropTypes.object.isRequired,
    stateEventEmitter: React.PropTypes.instanceOf(EventEmitter).isRequired,
    uiEventEmitter: React.PropTypes.instanceOf(EventEmitter).isRequired,
  },
});
