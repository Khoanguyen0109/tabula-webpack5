import React from 'react';

import { Avatar, Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: theme.spacing(2)
    },
    avatar: {
        marginRight: theme.spacing(1)
    },
    comment: {
        backgroundColor: 'white',
        padding: theme.spacing(1),
        border: '1px solid #E9ECEF',
        borderRadius: '2px 16px 16px 16px',
        '& .MuiTypography-root': {
            color: theme.newColors.gray[800],
            fontWeight: theme.fontWeight.normal,
            fontSize: theme.fontSize.small,
        }

    }
}));
function Comment() {
    const classes = useStyles();
    // const {comment} = props;
    return (
        <Box className={classes.root}>
                <Avatar className={classes.avatar}/>
                <Box className={classes.comment}>
                    <Typography>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </Typography>
                </Box>
        </Box>
    );
}

Comment.propTypes = {
  comment: PropTypes.object
};

export default Comment;
