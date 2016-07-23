import React from 'react';

import Tool from './Tool';


export default class PenTool extends Tool {
  render() {
    return (
      <div className="pen-tool js-pen-tool">
        <div className="plus-button">+</div>
        <div className="pen-width">{ this.props.penWidth }</div>
        <div className="minus-button">-</div>
      </div>
    );
  }
}

Object.assign(PenTool, {
  propTypes: Object.assign({}, Tool.propTypes, {
    penWidth: React.PropTypes.number.isRequired,
  }),
});
