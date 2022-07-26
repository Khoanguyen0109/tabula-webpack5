import React from 'react';
import { withRouter } from 'react-router';
import { matchPath } from 'react-router-dom';

import PropTypes from 'prop-types';

import Layout from './Layout';
import Layout1 from './Layout1';
import Layout2 from './Layout2';
import LayoutContent from './LayoutContent';
import LayoutProvider, { LayoutContext } from './LayoutContext';

const getMatchElement = (props) => {
  const location = props.location;
  let element, match;
  // We use React.Children.forEach instead of React.Children.toArray().find()
  // here because toArray adds keys to all child elements and we do not want
  // to trigger an unmount/remount for two <Route>s that render the same
  // component at different URLs.
  React.Children.forEach(props.children, (child) => {
    // eslint-disable-next-line eqeqeq
    if (match == null && React.isValidElement(child)) {
      element = child;

      const path = child.props.path || child.props.from;

      match = path
        ? matchPath(location.pathname, { ...child.props, path })
        : null;
    }
  });

  if (!match) {
    element = null;
  }

  // if (context.isPublic !== element.props.isPublic) {
  //   context.setData(element.props.isPublic);
  //   element = null;
  // }
  if (element) {
    element = React.cloneElement(element, { location, computedMatch: match });
  }
  return element;
};

// Reference from react-router Switch
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Switch.js
class SwitchLayout extends React.Component {
  static contextType = LayoutContext
  constructor(props, context) {
    super(props, context);
    this.state = {
      element: getMatchElement(props)
    };
    if (this.state.element.props.isPublic !== this.context.isPublic) {
      this.context.setData(this.state.element.props.isPublic);
    }
  }

  static getDerivedStateFromProps(props) {
    const element = getMatchElement(props);
    return {
      element
    };
  }

  /* eslint-disable react/prop-types */
  /* Stupid Eslint. */
  shouldComponentUpdate(nextProps, nextState) {
    const { element } = nextState;
    if (element.props.isPublic !== this.context.isPublic) {
      this.context.setData(element.props.isPublic);
      return false;
    }
    return true;
  }

  componentDidUpdate() {

  }

  render() {
    const { element } = this.state;
    // console.log(element, this.props);
    /* https://stackoverflow.com/questions/45621320/react-cloneelement-memory-efficiency */
    return element;
  }
}

SwitchLayout.propTypes = {
  children: PropTypes.node,
  location: PropTypes.object
};
export { LayoutProvider, LayoutContext, Layout, LayoutContent, Layout1, Layout2 };
export default withRouter(SwitchLayout);