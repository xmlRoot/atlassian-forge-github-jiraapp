import {
    getAllRepositoriesFromGithub,
    getAllOpenPullRequestFromGithub,
    mergePullRequestFromGithub,
    approvePullRequestFromGithub,
    unapprovePullRequestFromGithub
} from '../clients/github';

export const getAllRepositories = async ({ payload }) => {
    console.log("Getting all repostiories for token:", payload.token);
    return getAllRepositoriesFromGithub(payload.token)
        .then(data => {
            console.log('Fetched Repositories');
            return data.filter(repo => !repo.archived)
                .map(repo => ({
                    id: repo.id,
                    name: repo.name,
                    description: repo.description,
                    url: repo.html_url,
                    private: repo.private,
                    language: repo.language,
                    owner: repo.owner ? repo.owner.login : ""
                }));
        })
        .catch(error => {
            console.error("Error occurred:", error);
            throw Error(error)
        });
}

const extractTextCandidates = pr => {
    const candidates = [];
    if (pr.title) candidates.push(pr.title);
    if (pr.head && pr.head.ref) candidates.push(pr.head.ref);

    return candidates;
}

export const getAllOpenPRs = async ({ payload }) => {
    const { token, owner, name } = payload;
    console.log(`[${owner}] Getting all open PRs for repository: ${name}`);

    return getAllOpenPullRequestFromGithub(token, owner, name)
        .then(prs => {
            console.log('Fetched PRs for repositories');

            // Extract JIRA keys (uppercase letters + hyphen + digits) from title/branch
            const issueKeyRegex = /[A-Z][A-Z0-9_]*-\d+/g;

            const prsWithIssueKeys = prs.map(pr => {
                const keys = new Set();
                extractTextCandidates(pr)
                    .forEach(str => {
                        const matches = str.match(issueKeyRegex);
                        if (matches) matches.forEach(k => keys.add(k));
                    });

                return {
                    ...pr,
                    issueKeys: Array.from(keys)
                };
            });

            return prsWithIssueKeys;
        })
        .catch(error => {
            console.error("Error occurred:", error);
            throw Error(error)
        });
}

export const mergePR = async ({ payload }) => {
    const { token, owner, name, prId } = payload;
    console.log(`Merging PR[${prId}]>`);

    return mergePullRequestFromGithub(token, owner, name, prId)
        .then(response => {
            console.log(`Response for merging PR[${prId}]`, response);
            const { merged, message } = response;
            return { ok: merged, message };
        }).catch(err => ({
            ok: false, message: err.message
        }));
}

export const approvePR = async ({ payload }) => {
    const { token, owner, name, prId } = payload;
    console.log(`Approving PR[${prId}]>`);

    return approvePullRequestFromGithub(token, owner, name, prId)
        .then(response => {
            console.log(`Response for approving PR[${prId}]`, response);
            const { state, message } = response;
            return { ok: state === 'APPROVED', message: 'PR was approved' };
        }).catch(err => ({
            ok: false, message: err.message
        }));;
}

export const unapprovePR = async ({ payload }) => {
    const { token, owner, name, prId } = payload;
    console.log(`Unapproving PR[${prId}]>`);

    return unapprovePullRequestFromGithub(token, owner, name, prId)
        .then(response => {
            console.log(`Response for unapproving PR[${prId}]`, response);
            const { state, message } = response;
            return { ok: state === 'CHANGES_REQUESTED', message: 'PR was unapproved' };
        }).catch(err => ({
            ok: false, message: err.message
        }));;

}