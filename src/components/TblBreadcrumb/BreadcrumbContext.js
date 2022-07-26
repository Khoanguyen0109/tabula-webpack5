import React, { createContext, useContext, useState } from 'react';

export const BreadcrumbContext = createContext(null);
export const BreadcrumbConsumer = BreadcrumbContext.Consumer;

const BreadcrumbProvider = (props) => {
  const [breadcrumb, setBreadcrumb] = useState(null);
  const setData = (breadcrumb) => setBreadcrumb(breadcrumb);

  return <BreadcrumbContext.Provider value={{breadcrumb, setData}} {...props} />;
};

export const useBreadcrumbContext = () => useContext(BreadcrumbContext);

export default BreadcrumbProvider;