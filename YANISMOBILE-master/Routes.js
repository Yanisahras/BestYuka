import React from 'react';
import AppContextProvider from './context/AppContext';
import MainApp from './MainApp';

const Routes = () => {
  return (
    <AppContextProvider>
      <MainApp />
    </AppContextProvider>
  );
};

export default Routes;
