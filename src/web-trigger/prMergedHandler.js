import api, { route } from '@forge/api';
import { extractJiraIssueKeys } from '../clients/github';

export const prMergedHandler = async (request, context) => {
    //console.log("Request:", request);
    const payload = JSON.parse(request.body);
    const { number, action, pull_request } = payload;
    console.log(`number:`, number);
    console.log(`action:`, action);
    console.log(`pull_request:`, pull_request);

    // Ensure the event is a pull request merge
    if (action === 'closed' && pull_request.state === 'closed') {
        console.log(`PR[${number}] was merged:`, pull_request);
        const jiraIssueKeys = extractJiraIssueKeys(pull_request);
        if (jiraIssueKeys) {
            await Promise.all(
                jiraIssueKeys.map(async jiraIssueKey => {
                    console.log("Transitioning Jira Issue: ", jiraIssueKey);
                    await transitionJiraIssueToDone(jiraIssueKey);
                    return true;
                }));
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Webhook processed successfully' })
    };
};

const transitionJiraIssueToDone = async (issueKey) => {
    const transitionsResponse = await api.asApp()
        .requestJira(route`/rest/api/3/issue/${issueKey}/transitions`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
    const transitions = await transitionsResponse.json();

    const doneTransition = transitions.transitions.find(t => t.name === 'Done');
    if (doneTransition) {
        const transitionSuccessResponse = await api.asApp()
            .requestJira(route`/rest/api/3/issue/${issueKey}/transitions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ transition: { id: doneTransition.id } })
            });
        if (!transitionSuccessResponse.ok) {
            console.log("Transitioned Jira issue to Done failed:", transitionSuccessResponse);
        }
    }
};