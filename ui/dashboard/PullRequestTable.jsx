import React from 'react';
import {
    DynamicTable,
    Link,
    Button,
    Tag,
} from '@forge/react';

const PullRequestTable = ({ loading, pullRequests, onApprove, onMerge }) => {
    const head = {
        cells: [
            { key: 'title', content: 'Title' },
            { key: 'branch', content: 'Branch' },
            { key: 'author', content: 'Author' },
            { key: 'status', content: 'Status' },
            { key: 'actions', content: 'Actions' },
        ],
    };

    console.log('PullRequestTable:', pullRequests);
    const rows = pullRequests ? mapRows(pullRequests, onApprove, onMerge) : [];
    console.log('PullRequestTable rows:', rows);

    return (
        <DynamicTable
            head={head}
            rows={rows}
            rowsPerPage={100}
            defaultSortKey="title"
            isRankable={false}
            isLoading={loading}
            emptyView="There are no open Pull Requests for this repository."
        />
    );
}


const mapRows = (pullRequests, onApprove, onMerge) =>
    pullRequests.map((pr) => ({
        key: String(pr.id),
        cells: [
            {
                key: 'title',
                content: (
                    <Link href={pr.html_url} target="_blank">
                        {pr.title}
                    </Link>
                ),
            },
            {
                key: 'branch',
                content: pr.head?.ref ?? '-',
            },
            {
                key: 'author',
                content: pr.user?.login ?? '-',
            },
            {
                key: 'status',
                content: (
                    <Tag appearance={pr.state === 'open' ? 'inprogress' : 'success'}>
                        {pr.state.toUpperCase()}
                    </Tag>
                ),
            },
            {
                key: 'actions',
                content: (
                    <>
                        <Button
                            appearance="subtle"
                            spacing="compact"
                            onClick={() => onApprove(pr)}
                        >
                            Approve
                        </Button>
                        {pr.mergeable && (
                            <Button
                                appearance="primary"
                                spacing="compact"
                                onClick={() => onMerge(pr)}
                            >
                                Merge
                            </Button>
                        )}
                    </>
                ),
            },
        ],
    }));

export default PullRequestTable;
