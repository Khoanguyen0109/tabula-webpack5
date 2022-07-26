import React, { useEffect } from 'react';

import Fade from '@mui/material/Fade';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import makeStyles from '@mui/styles/makeStyles';

import clsx from 'clsx';
import { Layout2 } from 'layout';
import PropTypes from 'prop-types';

import TblCustomRef from '../TblCustomRef';

import TabPanel from './Panel';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTabs-root': {
      minHeight: 0,
    },
    '& .MuiTab-root': {
      textTransform: 'none',
      fontSize: theme.fontSize.normal,
      minWidth: (props) =>
        props?.minWidthItem ? `${props.minWidthItem}px` : '35px',
      padding: (props) =>
        props.bordered ? theme.spacing(1, 1, 0, 1) : theme.spacing(1, 0, 0, 0),
      fontWeight: theme.fontWeight.semi,
      color: theme.newColors.gray[400],
      borderBottom: (props) =>
        props.bordered ? `2px solid ${theme.mainColors.gray[4]}` : 'none',
      lineHeight: 0,
      marginRight: (props) => (props.bordered ? '0' : theme.spacing(2)),
    },
    '& .Mui-selected': {
      color: theme.palette.secondary.main,
    },
    '& .hidden': {
      display: 'none !important',
    },
  },
  rounded: {
    '& .MuiTabs-root': {
      minHeight: '29px',
      '& .MuiTab-root': {
        fontSize: theme.fontSize.small,
        padding: theme.spacing(0.75, 2.1),
        fontWeight: theme.fontWeight.semi,
        color: theme.palette.primary.main,
        backgroundColor: theme.newColors.gray[100],
        minHeight: '29px',
        lineHeight: 0,
        marginRight: '0px !important',
        '&:last-child': {
          borderTopRightRadius: '16px',
          borderBottomRightRadius: '16px',
        },
        '&:first-child': {
          borderTopLeftRadius: '16px',
          borderBottomLeftRadius: '16px',
        },
      },
      '& .Mui-selected': {
        color: 'white',
        zIndex: 2,
        lineHeight: 0,
      },
      '& .MuiTabs-indicator': {
        bottom: 0,
        top: 0,
        height: '100%',
        borderRadius: '16px',
        zIndex: 1,
      },
    },
  },
  vertical: {
    '& .MuiTabs-root': {
      '& .MuiTab-labelIcon': {
        minHeight: '44px',
        '& .MuiTab-wrapper': {
          flexDirection: 'row-reverse',
          alignItems: 'center',
          '& .MuiSvgIcon-root': {
            width: theme.spacing(3),
            height: theme.spacing(3),
          },
          '& > *:first-child ': {
            marginBottom: 0,
          },
        },
      },
      '& .MuiTab-root': {
        '&:first-child': {
          marginTop: theme.spacing(0),
        },
        '& .MuiSvgIcon-root': {
          marginBottom: 0,
        },
        marginTop: theme.spacing(0.5),
        padding: theme.spacing(0, 1.25),
        maxWidth: '100%',
        height: '44px',
        display: 'flex',
        flexDirection: 'row-reverse',
        borderRadius: '8px',
        justifyContent: 'space-between',
        '&:not(.Mui-selected)': {
          '&:hover': {
            backgroundColor: theme.mainColors.gray[4],
          },
        },
      },
      '& .Mui-selected': {
        backgroundColor: theme.openColors.white,
        border: `1px solid ${theme.newColors.gray[300]}`,
      },
      '& .MuiTabs-indicator': {
        visibility: 'hidden',
      },
    },
    '& .MuiIcon-root': {
      '& .MuiSkeleton-root': {
        width: '100%',
        height: '100%',
      },
    },
  },
}));

function a11yProps(index) {
  return {
    id: `tbl-tab-${index}`,
    'aria-controls': `tbl-tabpanel-${index}`,
  };
}

export default function TblTabs(props) {
  const classes = useStyles(props);
  const {
    layout,
    tabs,
    subTabs,
    titleSubTabs,
    onChange,
    indicatorColor,
    textColor,
    ariaLabel,
    variant,
    scrollButtons,
    type,
    orientation,
    selectedTab,
    selfHandleChange,
    ...others
  } = props;
  const [value, setValue] = React.useState(selectedTab);
  const [title, setTitle] = React.useState(tabs[selectedTab]?.name);

  useEffect(() => {
    if (selfHandleChange) {
      setValue(selectedTab);
      setTitle(tabs[selectedTab]?.name);
    }
  }, [selectedTab, selfHandleChange, tabs]);

  const handleChange = (event, newValue) => {
    if (selfHandleChange && onChange) {
      // Handle change by url
      onChange(event, newValue);
    } else {
      setValue(newValue);
      if (layout === 2) setTitle(tabs[newValue]?.name);
      if (onChange) onChange(event, newValue);
    }
  };

  const renderTabs = () => (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor={indicatorColor}
        textColor={textColor}
        aria-label={ariaLabel}
        variant={variant}
        scrollButtons={scrollButtons}
        orientation={orientation}
        {...others}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            icon={tab.icon}
            {...a11yProps(index)}
            className={`${tab.hidden ? 'hidden' : ''}`}
            {...tab}
          />
        ))}
      </Tabs>
      {titleSubTabs}
      {subTabs && (
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor={indicatorColor}
          textColor={textColor}
          aria-label={ariaLabel}
          variant={variant}
          scrollButtons={scrollButtons}
          orientation={orientation}
          {...others}
        >
          {subTabs?.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              {...a11yProps(index)}
              className={`${tab.hidden ? 'hidden' : ''}`}
              {...tab}
            />
          ))}
        </Tabs>
      )}
    </>
  );

  const renderTabPanel = () => {
    const allTabs = tabs.concat(subTabs);
    return allTabs.map((tab, index) => (
      <Fade key={index} in={value === index} timeout={700} title={''}>
        <TblCustomRef>
          <TabPanel
            value={value}
            index={index}
            classes={{ root: props.rootTabPanel }}
          >
            {tab.children}
          </TabPanel>
        </TblCustomRef>
      </Fade>
    ));
  };
  return (
    <div
      className={clsx(classes.root, {
        [classes.rounded]: type === 'round',
        [classes.vertical]: orientation === 'vertical',
      })}
    >
      {layout === 2 ? (
        <Layout2>
          <div>{renderTabs()}</div>
          <div title={title}>{renderTabPanel()}</div>
        </Layout2>
      ) : (
        <div>
          {renderTabs()}
          {renderTabPanel()}
        </div>
      )}
    </div>
  );
}

TblTabs.propTypes = {
  ariaLabel: PropTypes.string,
  indicatorColor: PropTypes.string,
  layout: PropTypes.number,
  minWidthItem: PropTypes.number,
  onChange: PropTypes.func,
  orientation: PropTypes.string,
  rootTabPanel: PropTypes.string,
  scrollButtons: PropTypes.string,
  selectedTab: PropTypes.number,
  selfHandleChange: PropTypes.bool,
  subTabs: PropTypes.array,
  tabs: PropTypes.array,
  textColor: PropTypes.string,
  titleSubTabs: PropTypes.any,
  type: PropTypes.string,
  variant: PropTypes.string,
};

TblTabs.defaultProps = {
  tabs: [],
  subTabs: [],
  indicatorColor: 'secondary',
  textColor: 'primary',
  ariaLabel: 'tabula tab',
  variant: 'standard',
  scrollButtons: 'auto',
  type: '',
  layout: 1,
  selectedTab: 0,
};
