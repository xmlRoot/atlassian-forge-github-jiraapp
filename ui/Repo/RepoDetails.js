import React from 'react';
import {Heading, Inline, Link, Lozenge, Tag} from "@forge/react";

const RepoDetails = ({repo}) => {
    console.info("Repo Details for repo", repo);
    return (
        <Inline space="space.100" alignBlock="center">
            <Heading as="h2">
                <Link href={repo.url} target="_blank">{repo.name}</Link>
            </Heading>
            <Lozenge appearance={repo.private ? 'removed' : 'success'} isBold>
                {repo.private ? 'Private' : 'Public'}
            </Lozenge>
            {
                repo.languages.map(l => {
                    console.info("Language", l);
                    return <Tag text={l} />
                })
            }
        </Inline>
    )

}

export default RepoDetails;