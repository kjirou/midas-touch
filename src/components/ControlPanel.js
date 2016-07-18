import React from 'react';


export default class ControlPanel extends React.Component {

  render() {
    const classList = ['control-panel'];
    if (this.props.isPlacedOnTop) classList.push('control-panel--is-placed-on-top');

    return (
      <div className={ classList.join(' ') }>
        Control Panel!
      </div>
    );
  }
}

Object.assign(ControlPanel, {
  propTypes: {
    isPlacedOnTop: React.PropTypes.bool.isRequired,
  },
});
