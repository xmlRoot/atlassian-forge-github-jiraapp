import React, { useState } from 'react';
import {
    LoadingButton,
    ButtonGroup,
    Box
} from '@forge/react';
import { approvePR, unapprovePR, mergePR } from "../api/githubApi";

const PrActionButtons = ({ pr, loginData, repository }) => {

    const showApprovalButtons = loginData.user !== pr.user?.login;

    const [isMergedSuccessfully, setMergedSuccessfully] = useState(false);
    const [merging, setMerging] = useState(false);
    const onMerge = prNumber => {
        setMerging(true);
        mergePR(loginData.token, repository.owner, repository.name, prNumber)
            .then(response => {
                setMerging(false);
                if (response.ok) {
                    alert(`Merged: ${response.message}`);
                    setMergedSuccessfully(true);
                } else {
                    alert(`Merge failed: ${response.message}`);
                }
            })
    };

    const [awaitsApproval, setAwaitsApproval] = useState(pr.awaitsApproval);
    const [approving, setApproving] = useState(false);
    const onApprove = prNumber => {
        setApproving(true);
        approvePR(loginData.token, repository.owner, repository.name, prNumber)
            .then(response => {
                setApproving(false);
                if (response.ok) {
                    alert(`Approved: ${response.message}`);
                    setAwaitsApproval(false);
                } else {
                    alert(`Approved failed: ${response.message}`);
                }
            })
    };
    const [unapproving, setUnapproving] = useState(false);
    const onUnapprove = prNumber => {
        setUnapproving(true);
        unapprovePR(loginData.token, repository.owner, repository.name, prNumber)
            .then(response => {
                setUnapproving(false);
                if (response.ok) {
                    alert(`Unapproved: ${response.message}`);
                    setAwaitsApproval(true);
                } else {
                    alert(`Unapproved failed: ${response.message}`);
                }
            })
    };

    const ApprovalsButton = () => awaitsApproval ? (
        <LoadingButton
            appearance="subtle"
            spacing="compact"
            iconAfter="check-mark"
            onClick={() => onApprove(pr.number)}
            isLoading={approving}
        >
            Approve
        </LoadingButton>
    ) : (
        <LoadingButton
            appearance="subtle"
            spacing="compact"
            iconAfter="check-mark"
            onClick={() => onUnapprove(pr.number)}
            isLoading={unapproving}
        >
            Unapprove
        </LoadingButton>
    );

    return (
        <Box>
            <ButtonGroup label="PR Actions">
                <LoadingButton
                    appearance="primary"
                    spacing="compact"
                    iconAfter="merge-success"
                    onClick={() => onMerge(pr.number)}
                    isLoading={merging}
                    isDisabled={pr.draft || isMergedSuccessfully}
                >
                    {isMergedSuccessfully ? "Merged" : "Merge"}
                </LoadingButton>
                {showApprovalButtons && <ApprovalsButton />}
            </ButtonGroup>
        </Box>
    )
};

export default PrActionButtons;