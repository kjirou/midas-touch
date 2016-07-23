import React from 'react';


export default class ControlPanel extends React.Component {

  _createButtons() {
    return this.props.buttons.map(({ label, classList, carrier }, index) => {
      const className = ['panel'].concat(classList).join(' ');
      const handler = carrier.bindContexts(this);

      return <div
        key={ `button-${ index }` }
        className={ className }
        onMouseDown={ handler }>{ label }</div>;
    });
  }

  render() {
    const classList = ['control-panel'];
    if (this.props.isPlacedOnTop) classList.push('control-panel--is-placed-on-top');

    return (
      <div className={ classList.join(' ') }>
        <div className="control-panel__panel-list">
          { this._createButtons() }
        </div>
      </div>
    );
  }
}

Object.assign(ControlPanel, {
  propTypes: {
    buttons: React.PropTypes.array.isRequired,
    isPlacedOnTop: React.PropTypes.bool.isRequired,
  },
});
