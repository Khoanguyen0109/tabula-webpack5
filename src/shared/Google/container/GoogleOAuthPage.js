import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

import { setUrlParam } from '../../../utils';

function GoogleOAuthPage() {
    const history = useHistory();
    const location = useLocation();
    const protocol = window.location.protocol;
    const urlSearchParams = new URLSearchParams(location.search);
    const envDomain = process.env.REACT_APP_BASE_URL ==='localhost' ? 'localhost:3000':process.env.REACT_APP_BASE_URL ;
    const subdomain = urlSearchParams.get('subdomain');

    const domainReceived = `${protocol}//${subdomain}.${envDomain}`;
    useEffect(() => {
        if(urlSearchParams.get('authSuccess') === 'true' ){
            const googleAccessToken =urlSearchParams.get('googleAccessToken');
            const expiryDate =urlSearchParams.get('expiryDate');
            
            const res = {
                googleAccessToken,
                expiryDate
            };
            if(window.opener){
                window.opener.postMessage( JSON.stringify(res) , domainReceived);

            }else{
                setUrlParam(location, history, {} , 'push' , null , '/block-third-party');
                // history.push('/block-third-party');
            }
            
        }else{
            const subCode =urlSearchParams.get('subcode');
            const connectedEmail =urlSearchParams.get('currentEmail');

            const res = {
                subCode,
                connectedEmail
            };
            if(window.opener){
                window.opener.postMessage( JSON.stringify(res) , domainReceived);

            }else{
                setUrlParam(location, history, {} , 'push' , null , '/');

            }
            window.close();

        }
        window.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    return (
        <div/>
    );
}

export default GoogleOAuthPage;
