// https://medium.com/trabe/implementing-private-routes-with-react-router-and-hooks-ed38d0cf93d5
import React, { createContext, useContext, useState } from 'react';

import { removeToken } from 'utils';

import { removeGoogleToken } from '../shared/Google/utils';

export const AuthDataContext = createContext(null);

const AuthDataProvider = (props) => {
  const initAuthData = {
    fetchingUser: false
    
  };
  const initDomainData = {
    fetchingDomain: false
  };
  const token = localStorage.getItem('access_token');
  if (token){
    initAuthData.token = token;
  }
  // Seperate state to make sure not conflict
  const [authData, setAuth] = useState(initAuthData);
  const [domainData, setDomain] = useState(initDomainData);

  /* The first time the component is rendered, it tries to
   * fetch the auth data from a source, like a cookie or
   * the localStorage.
   */
  // useEffect(() => {
  //   const token = localStorage.getItem('access_token');
  //   if (token) {
  //     setAuthData({token, fetching: true});
  //   }
  // }, []);

  const resetData = () => {
      removeToken();
      removeGoogleToken();
      setAuth({fetchingUser: false});
      setDomain({fetchingDomain: false});
  };
  
  const setData = (data, type) => {
    if (type === 'user') {
      setAuth({...authData, ...data});
    } else {
      setDomain({...domainData, data});
    }
  };

  // const authDataValue = useMemo({ ...authData, onLogin, onLogout }, [authData]);

  return <AuthDataContext.Provider value={{...authData, ...domainData, setData, resetData}} {...props} />;
};

export const useAuthDataContext = () => useContext(AuthDataContext);

export default AuthDataProvider;