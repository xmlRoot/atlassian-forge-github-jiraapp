import React, { useState, useEffect, useContext } from 'react';
import {
    Stack,
    Tag,
    Inline,
    Heading,
    Link,
    Text,
    Lozenge,
    Box
} from '@forge/react';
import { LoginContext } from '../context/LoginContext';
import Skeleton from '../util/Skeleton';
import PullRequestTable from './PullRequestTable';
import { getAllRepositories } from "../api/githubApi";

const RepositoryList = () => {
    const loginData = useContext(LoginContext);

    const [loading, setLoading] = useState(false);
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        setLoading(true);
        getAllRepositories(loginData.token)
            .then(data => {
                console.info("Repositories", data);
                setLoading(false);
                setRepositories(data);
                return data;
            });
    }, [loginData.token]);

    if (!loading && (!repositories || repositories.length === 0)) {
        return <Text>No repositories found.</Text>;
    }

    return (
        <Stack space="space.200">
            <Heading as="h1">Repositories</Heading>
            <Skeleton loading={loading}>
                {repositories
                    .sort(((a, b) => { 
                        if (a.private === b.private) {
                            return a.name.localeCompare(b.name);
                        } 
                        
                        if (a.private && !b.private) {
                            return 1; // a comes before b
                        } else {
                            return -1; // b comes before a
                        }
                    }))
                        .map((repo) => (
                            <Box key={repo.id}>
                                <Stack space="space.200">
                                    <Inline space="space.100" alignBlock="center">
                                        <Heading as="h2">
                                            <Link href={repo.url} target="_blank">{repo.name}</Link>
                                        </Heading>
                                        <Lozenge appearance={repo.private ? 'removed' : 'success'} isBold>
                                            {repo.private ? 'Private' : 'Public'}
                                        </Lozenge>
                                        {repo.language.length ? repo.language.map(l => <Tag text={l} />) : <></>}
                                    </Inline>
                                    <PullRequestTable repository={repo} />
                                </Stack>
                            </Box>
                        ))}
            </Skeleton>
        </Stack>
    );
}


export default RepositoryList;