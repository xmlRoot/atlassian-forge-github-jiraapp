import React from 'react';
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
import Skeleton from '../util/Skeleton';
import PullRequestTable from './PullRequestTable';

export default function RepositoryList({ repositories, loading, prs, loadingPrs }) {
  if (!loading && (!repositories || repositories.length === 0)) {
    return <Text>No repositories found.</Text>;
  }

  return (
    <Stack space="space.200">
        <Heading as="h1">Repositories</Heading>
        <Skeleton loading={loading}>
          {repositories.map((repo) => (
            <Box
              key={repo.id}
              xcss={{
                backgroundColor: 'color.background.neutral',
                padding: 'space.200',
                borderRadius: 'border.radius',
              }}
            >
                <Stack space="space.200">
                    <Inline space="space.100" alignBlock="center">
                        <Heading as="h2">
                            <Link href={repo.url} target="_blank">{repo.name}</Link>
                        </Heading>
                        <Lozenge appearance={repo.private ? 'removed' : 'success'} isBold>
                            {repo.private ? 'Private' : 'Public'}
                        </Lozenge>
                        {repo.language && <Tag text={repo.language} />}
                    </Inline>
                    <PullRequestTable loading={loadingPrs} pullRequests={prs[repo.id]} onApprove={() => alet('Approved')} onMerge={() => alet('Merged')} />
                </Stack>
            </Box>
          ))}
        </Skeleton>
    </Stack>
  );
}