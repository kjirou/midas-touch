import React from 'react';


export default class Page extends React.Component {
}

Object.assign(Page, {
  contextTypes: {
    publish: React.PropTypes.func.isRequired,
  },
  //defaultProps: {
  //  scene: null,
  //},
  propTypes: {
    root: React.PropTypes.object.isRequired,
  },
});
