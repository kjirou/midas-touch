import React from 'react';

import EventHandlerCarrier from '../lib/EventHandlerCarrier';


class ToolButton extends React.Component {
  render() {
    const className = ['tool-button'].concat(this.props.classNames || []).join(' ');
    const iconOrLabel = this.props.iconId ?
      <i className="material-icons">{ this.props.iconId }</i> : this.props.label;

    return (
      <div
        className={ className }
        onTouchStart={ this.props.action.bindContexts(this) }
      >
        { iconOrLabel }
      </div>
    );
  }
}
ToolButton.propTypes = {
  iconId: React.PropTypes.string,
  label: React.PropTypes.string,
  classNames: React.PropTypes.array,
  action: React.PropTypes.instanceOf(EventHandlerCarrier).isRequired,
};


export default class Toolbox extends React.Component {

  _createButtons() {
    return this.props.buttons.map((buttonData, index) => {
      return <ToolButton key={ `button-${ index }` } { ...buttonData } />
    });
  }

  render() {
    const classList = ['toolbox'];
    if (this.props.isOnTop) classList.push('toolbox--is-on-top');

    return (
      <div className={ classList.join(' ') }>
        <div className="toolbox__tool-buttons">
          { this._createButtons() }
        </div>
      </div>
    );
  }
}

Object.assign(Toolbox, {
  propTypes: {
    buttons: React.PropTypes.array.isRequired,
    isOnTop: React.PropTypes.bool.isRequired,
  },
});
