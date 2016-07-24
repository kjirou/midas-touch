import React from 'react';


export default class Toolbox extends React.Component {

  _createButtons() {
    return this.props.buttons.map(({ label, classList, action }, index) => {
      const className = ['tool-button'].concat(classList).join(' ');
      const handler = action.bindContexts(this);

      return <div
        key={ `button-${ index }` }
        className={ className }
        onMouseDown={ handler }>{ label }</div>;
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
