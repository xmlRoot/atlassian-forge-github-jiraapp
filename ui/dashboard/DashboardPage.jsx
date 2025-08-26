import React, { useState, useContext } from 'react';
import { Form, FormHeader, FormFooter, LoadingButton, Stack, Text, useForm } from '@forge/react';
import { LoginContext } from '../context/LoginContext';
import RepositoryList from "./RepositoryList";
import { logout } from "../api/loginApi";

const DashboardPage = ({ deleteToken }) => {
  const loginData = useContext(LoginContext);
  const { handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const onLogout = async () => {
    console.log('Attempting Logout');
    setLoading(true);
    logout()
      .then(response => {
        setLoading(false);
        console.log('logout() backend response:', response);
        if (response.ok) {
          deleteToken();
        }
      });
  }

  return (
    <Stack space="space.200">
      <Form onSubmit={handleSubmit(onLogout)}>
        <FormHeader title="Current user">
          <Text>User: {loginData.user}</Text>
          <Text>API Token: {loginData.token}</Text>
        </FormHeader>
        <FormFooter align="start">
          <LoadingButton appearance="primary" type="submit" isLoading={loading}>Logout</LoadingButton>
        </FormFooter>
      </Form>
      <RepositoryList />
    </Stack>
  );
};

export default DashboardPage;