import React, {useMemo} from 'react';
import {DynamicTable} from "@forge/react";

const PRDetails = ({repo, isLoading}) => {

    const mapRepo = repo => {
        console.info("Mapping", repo);
        return {
            key: repo.id,
            cells: [
                {
                    key: `issues`,
                    content: "-",
                },
                {
                    key: `title`,
                    content: repo.name,
                },
                {
                    key: `sourceBranch`,
                    content: "-",
                },
                {
                    key: `targetBranch`,
                    content: "-",
                },
                {
                    key: `author`,
                    content: "-",
                },
                {
                    key: `status`,
                    content: "-",
                },
                {
                    key: `actions`,
                    content: "-",
                },
            ]
        }
    }

    const head = useMemo( () => ({
        cells: [
            { key: 'issues', content: 'Jira issues' },
            { key: 'title', content: 'Title' },
            { key: 'sourceBranch', content: 'Source Branch' },
            { key: 'transition', content: '' },
            { key: 'targetBranch', content: 'Target Branch' },
            { key: 'author', content: 'Author' },
            { key: 'status', content: 'Status' },
            { key: 'actions', content: 'Actions' },
        ],
    }), []);

    const rows = mapRepo(repo);

    return (
        <>
            <DynamicTable
                head={head}
                rows={rows}
                rowsPerPage={100}
                defaultSortKey="title"
                isRankable={false}
                isLoading={isLoading}
                loadingSpinnerSize="small"
                isFixedSize={true}
                emptyView="There are no open Pull Requests for this repository."
            />
        </>
    );

}

export default PRDetails;