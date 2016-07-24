import React from 'react';

import EventHandlerCarrier from '../../lib/EventHandlerCarrier';
import Tool from './Tool';


export default class PenTool extends Tool {
  render() {
    const classList = ['pen-tool'];
    if (this.props.isOnTop) classList.push('pen-tool--is-on-top');

    return (
      <div className={ classList.join(' ') }>
        <div className="plus-button" onTouchStart={ this.props.plusAction.bindContexts(this) }>+</div>
        <div className="pen-width">{ this.props.penWidth }</div>
        <div className="minus-button" onTouchStart={ this.props.minusAction.bindContexts(this) }>-</div>
      </div>
    );
  }
}

Object.assign(PenTool, {
  propTypes: Object.assign({}, Tool.propTypes, {
    isOnTop: React.PropTypes.bool.isRequired,
    penWidth: React.PropTypes.number.isRequired,
    plusAction: React.PropTypes.instanceOf(EventHandlerCarrier),
    minusAction: React.PropTypes.instanceOf(EventHandlerCarrier),
  }),
});
