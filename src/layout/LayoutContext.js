import React, { createContext, useContext, useState } from 'react';

export const LayoutContext = createContext(null);

const LayoutProvider = (props) => {
  const [isPublic, setAuthData] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const setData = (isPublic) => setAuthData(isPublic);

  // const authDataValue = useMemo({ ...authData, onLogin, onLogout }, [authData]);

  return <LayoutContext.Provider value={{isPublic, setData , fullScreen, setFullScreen}} {...props} />;
};

export const useLayoutContext = () => useContext(LayoutContext);

export default LayoutProvider;