import React from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiExpansionPanel from '@mui/material/Accordion';
import MuiExpansionPanelDetails from '@mui/material/AccordionDetails';
import MuiExpansionPanelSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import PropTypes from 'prop-types';

const Accordion = withStyles(() => ({
  root: {
    marginBottom: 40,

    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      // margin: 'auto',
    },
  },
  expanded: {},
}))(MuiExpansionPanel);

const AccordionSummary = withStyles((theme) => ({
  root: {
    backgroundColor: theme.newColors.gray[100],
    border: `1px solid ${theme.mainColors.gray[4]}`,
    borderRadius: theme.spacing(0.5),
    color: theme.mainColors.primary1[1],
    textTransform: 'uppercase',
    minHeight: 41,

    '&$expanded': {
      minHeight: 41,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
      
      '& .MuiSvgIcon-root': {
        transform: 'rotate(180deg)',
      }
    },
    '& .MuiSvgIcon-root': {
      transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      width: theme.spacing(2.5),
      height: theme.spacing(2.5),
      marginLeft: theme.spacing(0.5),
    },
    '& .MuiTypography-root': {
      fontSize: theme.fontSize.small,
      fontWeight: theme.fontWeight.semi
    }
  },
  expanded: {},
}))(MuiExpansionPanelSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 1),
    maxWidth: '100%',
    height: 'auto',
    '& .MuiBox-root': {
      maxWidth: '100%',
    }
  },
}))(MuiExpansionPanelDetails);

export default function TblExpansionPanels(props) {
  let initialExpended = [];
  if (props.expendedAll) {
    if (props.expendedAll) {
      props.panels.map((panel, index) => initialExpended.push(`panel${index}`));
    }
  } else {
    initialExpended = ['panel0'];
  };

  const [expanded, setExpanded] = React.useState(initialExpended);

  const handleChange = (panel) => (event, newExpanded) => {
    const currentExpanded = [...expanded];
    newExpanded ? currentExpanded.push(panel) : currentExpanded.splice(currentExpanded.indexOf(panel), 1);

    setExpanded(currentExpanded);
    if (props.onChangePanel) {
      props.onChangePanel({ newExpanded, panel, currentExpanded });
    }
  };

  return (
    <Box>
      {
        props.panels.map((panel, index) => (
            <Accordion TransitionProps={{ unmountOnExit: props.unMountOnExit }} key={`panel${index}`} expanded={expanded.includes(`panel${index}`)} onChange={handleChange(`panel${index}`)}>
              <AccordionSummary aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
                <Typography>{panel.title} </Typography>
                <ExpandMoreIcon />
              </AccordionSummary>
              <AccordionDetails>
                {panel.children}
              </AccordionDetails>
            </Accordion>
          ))
      }
    </Box>
  );
}

TblExpansionPanels.defaultProps = {
  panels: [],
  expendedAll: false,
  unMountOnExit: false
};

TblExpansionPanels.propTypes = {
  panels: PropTypes.array,
  expendedAll: PropTypes.bool,
  unMountOnExit: PropTypes.bool,
  onChangePanel: PropTypes.func
};