import React from 'react';

import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    image: {
        width: '100%',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px'
    },
    label: {
        fontSize: theme.fontSize.medium,
        fontWeight: theme.fontWeight.semi,
        color: theme.newColors.gray[900],
        marginBottom: theme.spacing(1)
    },
    content: {
        fontSize: theme.fontSize.small,
        fontWeight: theme.fontWeight.normal,
        wordBreak: 'break-word',
        color: theme.newColors.gray[900],
    }
  }));

function TourContent(props) {
    const {label, content, image} = props;
    const classes = useStyles();
    return (
        <Box className={classes.root}> 
            {image&& <Box marginX={-2} marginTop={-2} >
                    <img className={classes.image} src={image} alt=''/>
                </Box>}
            <div className={classes.label}>{label}</div>
            <div className={classes.content}>{content}</div>
        </Box>
    );
}

TourContent.propTypes = {
  content: PropTypes.string,
  image: PropTypes.element,
  label: PropTypes.string
};

export default TourContent;
