import React, { useState } from 'react';
import { Form, FormHeader, FormFooter, LoadingButton, Text, useForm } from '@forge/react';
import { logout } from "../services/tokenService";

const DashboardPage = ({ apiToken, deleteToken }) => {
  const { handleSubmit } = useForm();
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const onLogout = async () => {
    console.log('Attempting Logout');
    setIsLoadingForm(true);
    logout()
      .then(response => {
        setIsLoadingForm(false);
        console.log('logout() backend response:', response);
        if (response.ok) {
          deleteToken();
        }
      });
  }
  return (
    <Form onSubmit={handleSubmit(onLogout)}>
      <FormHeader title="Current API Token">{apiToken}</FormHeader>
      <FormFooter align="start">
        <LoadingButton appearance="primary" type="submit" isLoading={isLoadingForm}>Logout</LoadingButton>
      </FormFooter>
    </Form>
  );
};

export default DashboardPage;