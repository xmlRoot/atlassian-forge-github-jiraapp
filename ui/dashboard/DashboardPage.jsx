import React, { useState, useEffect } from 'react';
import { Form, FormHeader, FormFooter, LoadingButton, Stack, useForm } from '@forge/react';
import RepositoryList from "./RepositoryList";
import { logout } from "../api/tokenApi";
import { getAllRepositories, getAllOpenPRs } from "../api/githubApi";

const DashboardPage = ({ apiToken, deleteToken }) => {
  const { handleSubmit } = useForm();
  const [isLoadingForm, setLoadingForm] = useState(false);
  const onLogout = async () => {
    console.log('Attempting Logout');
    setLoadingForm(true);
    logout()
      .then(response => {
        setLoadingForm(false);
        console.log('logout() backend response:', response);
        if (response.ok) {
          deleteToken();
        }
      });
  }

  const [isLoadingRepositories, setLoadingRepositories] = useState(false);
  const [repositories, setRepositories] = useState([]);

  const [isLoadingPrs, setLoadingPrs] = useState(false);
  const [prs, setPrs] = useState({});
  
  useEffect(() => {
    const loadData = async () => {
      // Load all repositories
      setLoadingRepositories(true);
      const fetchedRepos = await getAllRepositories(apiToken)
        .then(data => {
          setLoadingRepositories(false);
          setRepositories(data);
          return data;
        });

      if (fetchedRepos) {
        // Load all PRs for each repository
        setLoadingPrs(true);
        const reposWithPRs = await Promise.all(
          fetchedRepos.map(async (repo) => {
            const prs = await getAllOpenPRs(apiToken, repo.owner, repo.name);
            return { ...repo, prs };
          })
        );
        const prsMapping = {};
        reposWithPRs.forEach(repo => { 
          prsMapping[repo.id] = repo.prs
        });
        console.log('All PRs:', prsMapping);
        setPrs(prsMapping);
        setLoadingPrs(false);
      }
    };

    loadData();
  }, [apiToken]);


  return (
    <Stack space="space.200">
      <Form onSubmit={handleSubmit(onLogout)}>
        <FormHeader title="Current API Token">{apiToken}</FormHeader>
        <FormFooter align="start">
          <LoadingButton appearance="primary" type="submit" isLoading={isLoadingForm}>Logout</LoadingButton>
        </FormFooter>
      </Form>
      <RepositoryList repositories={repositories} loading={isLoadingRepositories} prs={prs} loadingPrs={isLoadingPrs} />
    </Stack>
  );
};

export default DashboardPage;