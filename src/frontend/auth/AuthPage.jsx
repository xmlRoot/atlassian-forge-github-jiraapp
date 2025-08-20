import React, { useState } from 'react';
import { Form, FormHeader, FormSection, FormFooter, Label, Textfield, LoadingButton, HelperMessage, Stack, Image, RequiredAsterisk, useForm, ErrorMessage, SectionMessage, Text } from '@forge/react';
import { login } from "../services/tokenService";

const AuthPage = ({ saveToken }) => {
  const { register, getFieldId, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [saveError, setSaveError] = useState(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const onLoginSuccess = async (data) => {
    const { token } = data;
    console.log('Attempting to save GitHub token:', token);
    setIsLoadingForm(true);
    setSaveError(null);
    login(token)
      .then(response => {
        setIsLoadingForm(false);
        console.log('login() backend response:', response);
        if (response.ok) {
          saveToken(token);
        } else {
          setSaveError(response.message);
        }
    });
  }
  return (
    <Stack grow="fill" alignBlock="center" alignInline="center">
        <Stack space="space.200" alignInline="center">
            <Form onSubmit={handleSubmit(onLoginSuccess)}>
                <FormHeader title="Login">
                    Connect your GitHub account to view the Dashboard.
                </FormHeader>
                <FormSection>
                    {saveError && <SectionMessage appearance='error'><Text weight="bold">Login failed:</Text>{saveError}</SectionMessage>}
                </FormSection>
                <FormSection>
                    <Image alt="GitHub logo" height="330px" src="https://www.molecularecologist.com/wp-content/uploads/2013/11/github-logo-1.jpg" />
                </FormSection>
                <FormSection>
                    <Label labelFor={getFieldId('token')}>GitHub API token <RequiredAsterisk /></Label>
                    <Textfield {...register('token', { required: true, minLength: {value: 5, message: 'Token must be at least 5 characters long'} })} placeholder="Enter your GitHub API token" />
                    <HelperMessage>Use a dedicated Personal Access Token (Classic) created in GitHub.</HelperMessage>
                    {errors.token && <ErrorMessage>{errors.token.message}</ErrorMessage>}
                </FormSection>
                <FormFooter>
                    <LoadingButton shouldFitContainer appearance="primary" type="submit" isLoading={isLoadingForm} >
                        Login
                    </LoadingButton>
                </FormFooter>
            </Form>
        </Stack>
    </Stack>
  );
};

export default AuthPage;