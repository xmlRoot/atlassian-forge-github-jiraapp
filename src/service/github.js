import github from '../clients/github';
import jira from "../clients/jira";

const getAllRepositories = async ({token}) => {
    return github.repo.listAll(token)
        .then(({ repos }) => {
            return repos.map(repo => {
                console.info("Mapping Repo:", repo);
                console.info("Mapping Repo:", repo.languages.nodes.map(l => l.name));
                return {
                    id: repo.id,
                    name: repo.name,
                    description: repo.description,
                    url: repo.html_url,
                    private: repo.private,
                    language: repo.languages.nodes.map(l => l.name),
                    owner: repo.owner ? repo.owner.login : "",
                    prs: {
                        count: repo.pullRequests.totalCount,
                        list : repo.pullRequests.nodes.map(pr => ({
                            ...pr,
                            issueKeys: jira.extractKeysFromText(pr.title)
                        }))
                    }
                };
            });
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

const getAllOpenPRs = async ({token, owner, name}) => {
    console.log(`[${owner}] Getting all open PRs for repository: ${name}`);

    return github.pr.listAllOpen(token, owner, name)
        .then(prs => {
            console.log('Fetched PRs for repositories');
            // Extract JIRA keys (uppercase letters + hyphen + digits) from title/branch
            return prs.map(pr => {
                const keys = extractTextCandidates(pr).flatMap(jira.extractKeysFromText)
                return {
                    ...pr,
                    issueKeys: Array.from(keys)
                };
            });
        })
        .catch(error => {
            console.error("Error occurred:", error);
            throw Error(error)
        });
}

const mergePR = async ({token, owner, name, prId}) => {
    console.log(`Merging PR[${prId}]>`);

    return github.pr.merge(token, owner, name, prId)
        .then(response => {
            console.log(`Response for merging PR[${prId}]`, response);
            const {merged, message} = response;
            return {ok: merged, message};
        }).catch(err => ({
            ok: false, message: err.message
        }));
}

const approvePR = async ({token, owner, name, prId}) => {
    console.log(`Approving PR[${prId}]>`);

    return github.pr.approve(token, owner, name, prId)
        .then(response => {
            console.log(`Response for approving PR[${prId}]`, response);
            const {state, message} = response;
            return {ok: state === 'APPROVED', message: 'PR was approved'};
        }).catch(err => ({
            ok: false, message: err.message
        }));
    ;
}

const unapprovePR = async ({token, owner, name, prId}) => {
    console.log(`Unapproving PR[${prId}]>`);

    return github.pr.unapprove(token, owner, name, prId)
        .then(response => {
            console.log(`Response for unapproving PR[${prId}]`, response);
            const {state, message} = response;
            return {ok: state === 'CHANGES_REQUESTED', message: 'PR was unapproved'};
        }).catch(err => ({
            ok: false, message: err.message
        }));
}

const githubService = {
    getAllRepositories,
    getAllOpenPRs,
    mergePR,
    approvePR,
    unapprovePR
}

export default githubService;