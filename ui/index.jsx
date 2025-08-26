import React, { useEffect, useState } from 'react';
import ForgeReconciler from '@forge/react';
import { getLoginData } from "./api/loginApi";
import Skeleton from './util/Skeleton';
import AuthPage from './auth/AuthPage';
import DashboardPage from './dashboard/DashboardPage';
import { LoginDataProvider } from './context/LoginContext';

const EMPTY_LOGIN_DATA = { token: null };

const App = () => {
  const [loading, setLoading] = useState(false);
  const [loginData, setData] = useState(EMPTY_LOGIN_DATA);

  useEffect(() => {
    setLoading(true);
    getLoginData()
      .then(data => {
        console.log('getLoginData() backend response:', data);
        setLoading(false);
        setData(data);
      });
  }, []);

  return (
    <Skeleton loading={loading} centered>
      <LoginDataProvider loginData={loginData}>
        {loginData?.token
          ? <DashboardPage deleteToken={() => setData(EMPTY_LOGIN_DATA)} />
          : <AuthPage onLoginSuccess={token => setData({ token })} />}
      </LoginDataProvider>
    </Skeleton>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
