import React from 'react';

import EventHandlerCarrier from '../../lib/EventHandlerCarrier';
import Tool from './Tool';


export default class SpinnerTool extends Tool {
  render() {
    const classList = ['spinner-tool'];
    if (this.props.isOnTop) classList.push('spinner-tool--is-on-top');

    return (
      <div className={ classList.join(' ') }>
        <div className="plus-button" onTouchStart={ this.props.plusAction.bindContexts(this) }>+</div>
        <div className="value">{ this.props.value }</div>
        <div className="minus-button" onTouchStart={ this.props.minusAction.bindContexts(this) }>-</div>
      </div>
    );
  }
}

Object.assign(SpinnerTool, {
  propTypes: Object.assign({}, Tool.propTypes, {
    isOnTop: React.PropTypes.bool.isRequired,
    value: React.PropTypes.number.isRequired,
    plusAction: React.PropTypes.instanceOf(EventHandlerCarrier),
    minusAction: React.PropTypes.instanceOf(EventHandlerCarrier),
  }),
});
