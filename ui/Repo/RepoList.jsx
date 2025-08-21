import {Box, Stack} from "@forge/react";
import React, {useEffect, useState} from "react";
import {invoke} from "@forge/bridge";
import RepoDetails from "./RepoDetails";
import {Loader} from "../Layout";
import PRDetails from "../PR";

const RepoList = ({token}) => {

    const [repos, setRepos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const loadRepos = async () => {
        const repoList = await invoke('listRepos', {token});
        console.info("Repo", repoList);
        setRepos(repoList);
        setIsLoading(false);
    }
    useEffect(loadRepos, []);

    if (repos.length === 0) return (<Loader/>)
    else return (
        <>
            {repos.map(repo => {
                return (
                    <>
                        <Box key={repo.id}>
                            <Stack space="space.200">
                                <RepoDetails repo={repo} />
                                {/*<PRDetails repo={repo} isLoading={isLoading}/>*/}
                            </Stack>
                        </Box>
                    </>
                );
            })}
        </>
    );
};

export default RepoList;