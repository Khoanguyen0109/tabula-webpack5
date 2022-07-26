import React from 'react';

import PropTypes from 'prop-types';

export default class IgnoreError extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    // console.log(error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
IgnoreError.propTypes = {
  children: PropTypes.any,
};
