import React, { useState, useEffect, useContext } from 'react';
import {
    DynamicTable,
    Link,
    Lozenge,
    Icon,
    Box,
    Stack
} from '@forge/react';
import PrActionButtons from './PrActionButtons';
import { LoginContext } from '../context/LoginContext';
import { getAllOpenPRs } from "../api/githubApi";

const getPrStatus = state => {
    if (!state) return 'IN PROGRESS';

    switch (state.toUpperCase()) {
        case 'OPEN': return 'OPEN';
        case 'MERGED': return 'MERGED';
        default: return 'IN PROGRESS';
    }
}

const PullRequestTable = ({ repository }) => {
    const loginData = useContext(LoginContext);

    const [loading, setLoading] = useState(false);
    const [pullRequests, setPullRequests] = useState(repository.prs || []);

    const head = {
        cells: [
            { key: 'issues', content: 'Jira issues' },
            { key: 'title', content: 'Title' },          
            { key: 'sourceBranch', content: 'Source Branch' },
            { key: 'transition', content: '' },
            { key: 'targetBranch', content: 'Target Branch' },
            { key: 'author', content: 'Author' },
            { key: 'draft', content: 'Draft' },
            { key: 'status', content: 'Status' },
            { key: 'actions', content: 'Actions' },
        ],
    };

    console.log(`Pull requests for ${repository.name}:`, pullRequests);

    const rows = pullRequests.list.map((pr) => ({
        key: String(pr.id),
        cells: [
            {
                key: 'issues',
                content: (
                    <Stack>
                        {pr.issueKeys.map(key =>
                            <Link href={`/browse/${key}`} target="_blank">
                                {key}
                            </Link>
                        )}
                    </Stack>
                )
            },
            {
                key: 'title',
                content: (
                    <Link href={pr.url} target="_blank">
                        {pr.title}
                    </Link>
                )
            },
            {
                key: 'sourceBranch',
                content: pr.sourceBranch ?? '-'
            },
            {
                key: 'transition',
                content: (<Icon glyph='arrow-right' />)
            },
            {
                key: 'targetBranch',
                content: pr.targetBranch ?? '-'
            },
            {
                key: 'author',
                content: pr.author?.login ?? '-'
            },
            {
                key: 'status',
                content: pr.draft ? (<Lozenge appearance='subtle' isBold>DRAFT</Lozenge>) : <Box />
            },
            {
                key: 'status',
                content: (<Lozenge appearance={pr.state === 'open' ? 'inprogress' : 'success'} isBold>{getPrStatus(pr.state)}</Lozenge>)
            },
            {
                key: 'actions',
                content: (<PrActionButtons pr={pr} loginData={loginData} repository={repository} />)
            },
        ],
    }));

    return (
        <DynamicTable
            head={head}
            rows={rows}
            rowsPerPage={100}
            defaultSortKey="title"
            isRankable={false}
            isLoading={loading}
            loadingSpinnerSize="small"
            isFixedSize={true}
            emptyView="There are no open Pull Requests for this repository."
        />
    );
}

export default PullRequestTable;
