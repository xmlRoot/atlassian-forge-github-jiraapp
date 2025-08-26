import React, { createContext, useState } from 'react';

export const LoginContext = createContext();

export const LoginDataProvider = ({ loginData, children }) => {
  return (
    <LoginContext.Provider value={loginData}>
      {children}
    </LoginContext.Provider>
  );
};