import React from 'react';


export default class ControlPanel extends React.Component {

  render() {
    const classList = ['control-panel'];
    if (this.props.isPlacedOnTop) classList.push('control-panel--is-placed-on-top');

    return (
      <div className={ classList.join(' ') }>
        <div className="control-panel__panel-list">
          <div className="panel">Undo</div>
          <div className="panel">Redo</div>
        </div>
      </div>
    );
  }
}

Object.assign(ControlPanel, {
  propTypes: {
    isPlacedOnTop: React.PropTypes.bool.isRequired,
  },
});
