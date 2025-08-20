import React, { useEffect, useState } from 'react';
import ForgeReconciler from '@forge/react';
import { getToken } from "./services/tokenService";
import Skeleton from './util/Skeleton';
import AuthPage from './auth/AuthPage';
import DashboardPage from './dashboard/DashboardPage';

const App = () => {
  const [apiToken, setApiToken] = useState({ loading: false, value: null });
  const setLoadingApiToken = () => setApiToken({ loading: true, value: null });

  useEffect(() => {
    setLoadingApiToken();
    getToken()
      .then(token => {
        console.log('getToken() backend response:', token);
        setApiToken({ loading: false, value: token });
      });
  }, []);
  
  const { loading, value } = apiToken;
  return (
    <Skeleton loading={loading}>
      {value 
        ? <DashboardPage apiToken={value} deleteToken={() => setApiToken({ loading: false, value: null })} />
        : <AuthPage saveToken={token => setApiToken({ loading: false, value: token })} />}
    </Skeleton>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
