/* eslint-disable no-console */
import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import TabulaButton from 'components/TblButton';

import * as Sentry from '@sentry/browser';
import {ReactComponent as Image} from 'assets/images/500_error.svg';
import PropTypes from 'prop-types';

export default class InternalError extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            height: document.body.clientHeight || window.innerHeight
        };
    }

    static getDerivedStateFromError(error) {
        // eslint-disable-next-line no-console
        console.log(error);
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    handleResize() {
        this.setState({
          height: document.body.clientHeight
        });
      }
    
    componentDidMount() {
        // bind window resize listeners
        this._handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this._handleResize);
        setTimeout(this._handleResize, 1000);
    }

    componentWillUnmount() {
    // clean up listeners
        window.removeEventListener('resize', this._handleResize);
    }
    
    componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
        console.log('=== ERROR ===');
        console.log(error, errorInfo);
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            const eventId = Sentry.captureException(error);
            this.setState({eventId});
        });
    // logErrorToMyService(error, errorInfo);
    }

    goToHome = () => {
        // Force refresh page to make sure reset
        window.location = '/';
    }

    render() {
        const { hasError, height } = this.state;
        const {history} = this.props;
        // console.log('Internal', hasError);
        if (hasError) {
            return <Grid container id='internal-error' alignItems='center' alignContent='center' style={{height, paddingTop: height * 0.1}}>
                    <Grid lg={12} md={12} item >
                        <Box display='flex' alignItems='center' alignContent='center' justifyContent='center'><Image /></Box>
                        <Box display='flex' justifyContent='center'>
                            <TabulaButton color='primary' variant='contained' onClick={() => history ? history.go(0) : ''}>Try Again</TabulaButton>
                            <TabulaButton onClick={this.goToHome}>Back to Home</TabulaButton>
                        </Box>
                    </Grid>
                </Grid>;
        }
        return this.props.children;
    }
}
InternalError.propTypes = {
    history: PropTypes.object,
    children: PropTypes.any
};