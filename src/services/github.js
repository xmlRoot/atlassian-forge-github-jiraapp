import { getAllRepositoriesFromGithub, getAllOpenPullRequestFromGithub } from '../clients/github';

export const getAllRepositories = async ({ payload }) => {
    console.log("Getting all repostiories for token:", payload.token);
    return getAllRepositoriesFromGithub(payload.token)
        .then(data => {
            // console.log('Fetched Repositories:', data);
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

export const getAllOpenPRs = async ({ payload }) => {
    const { token, owner, name } = payload;
    console.log(`[${owner}] Getting all open PRs for repository: ${name}`);
    
    return getAllOpenPullRequestFromGithub(token, owner, name)
        .then(prs => {
            console.log('Fetched PRs for repositories:', prs);

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

const extractTextCandidates = pr => {
    const candidates = [];
    if (pr.title) candidates.push(pr.title);
    if (pr.head && pr.head.ref) candidates.push(pr.head.ref);

    return candidates;
}