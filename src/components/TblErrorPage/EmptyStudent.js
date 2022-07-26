import React from 'react';
import { Translation } from 'react-i18next';

import isBoolean from 'lodash/isBoolean';
import isString from 'lodash/isString';

import withStyles from '@mui/styles/withStyles';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import EmptyContentForStudent from 'shared/MyCourses/components/EmptyContentForStudent';

import { Layout1 } from 'layout';
import PropTypes from 'prop-types';

const styled = ({ newColors }) => ({
  content: {
    height: 'calc(100vh - 130px)',
  },
  layout: {
    backgroundColor: newColors.gray[100],
  },
});

class EmptyStudent extends React.PureComponent {
  static contextType = BreadcrumbContext;

  componentDidMount() {
    const { t, title } = this.props;
    this.context.setData({
      bodyContent: t(title),
    });
  }

  render() {
    const { classes, children } = this.props;
    return (
      <Layout1 className={classes.layout} scrollable={false}>
        <div className={classes.content}>
          {children || <EmptyContentForStudent />}
        </div>
      </Layout1>
    );
  }
}

EmptyStudent.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  children: PropTypes.node,
  title: PropTypes.string,
};

const TranslationWrapper = (props) => {
  let ns = ['common'];
  if (isString(props.ns)) {
    ns.push(props.ns);
  } else if (isBoolean(props.ns)) {
    ns = ns.concat(props.ns);
  }
  return (
    <Translation ns={ns}>
      {(t) => <EmptyStudent t={t} {...props} />}
    </Translation>
  );
};

TranslationWrapper.propTypes = {
  ns: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

export default withStyles(styled)(TranslationWrapper);
