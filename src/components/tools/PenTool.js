import React from 'react';

import Tool from './Tool';


export default class PenTool extends Tool {
  render() {
    const classList = ['pen-tool'];
    if (this.props.isOnTop) classList.push('pen-tool--is-on-top');

    return (
      <div className={ classList.join(' ') }>
        <div className="plus-button">+</div>
        <div className="pen-width">{ this.props.penWidth }</div>
        <div className="minus-button">-</div>
      </div>
    );
  }
}

Object.assign(PenTool, {
  propTypes: Object.assign({}, Tool.propTypes, {
    isOnTop: React.PropTypes.bool.isRequired,
    penWidth: React.PropTypes.number.isRequired,
  }),
});
