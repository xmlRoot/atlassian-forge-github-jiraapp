import {fetch} from '@forge/api';

const GITHUB_API_URL_BASE = 'https://api.github.com';

const authHeadersFor = token => ({
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
    }
});

const GRAPHQL_QUERY = `
query {
  viewer {
    repositories(isArchived: false, first: 100) {
      nodes {
        id
        name
        languages(first: 10) {
            nodes {
              name
            }
        }
        pullRequests(states: OPEN, first: 20) {
          totalCount
          nodes {
            id
            title
            url
            author {
              login
            }
            targetBranch: baseRefName
            sourceBranch: headRefName
            state
          }
        }
      }
    }
  }
}
`

const listAllRepos = async (token) => {
    const response = await fetch(`${GITHUB_API_URL_BASE}/graphql`, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token}`},
        body: JSON.stringify({query: GRAPHQL_QUERY})
    });

    if (response.status !== 200)
        throw Error('Failed to fetch repos');
    const json = await response.json();
    const repos = await json.data.viewer.repositories.nodes;
    return {
        "ok": true,
        repos,
    };
}

const getAllOpenPullRequestFromGithub = async (token, owner, name) => {
    if (!token) throw new Error('GitHub token is required to list pull requests');
    if (!owner) throw new Error('Repository owner is required to list pull requests');
    if (!name) throw new Error('Repository name is required to list pull requests');

    const onlySearchForPrsInState = 'open';
    const pageLimit = '100';
    const response = await fetch(
        `${GITHUB_API_URL_BASE}/repos/${owner.toUpperCase()}/${name.toUpperCase()}/pulls?state=${onlySearchForPrsInState}&per_page=${pageLimit}`,
        authHeadersFor(token)
    );

    if (!response.ok) {
        const text = await response.text().catch(() => response.statusText);
        throw new Error(`GitHub pull requests request failed: ${response.status} ${text}`);
    }

    const prs = await response.json();

    const processedPrs = await Promise.all(
        prs.map(
            async pr => ({
                ...pr,
                issueKeys: extractJiraIssueKeys(pr),
                // We should also pass the currentlyLoggedUser (not the just the owner). However adding this additional logic seems out-of-scope
                awaitsApproval: await isNotApprovedBy(token, pr, owner)
            })
        )
    );

    return processedPrs;
}

// TODO: This approach is naive. Implement a more robust way ot extracting.
// Extract JIRA keys (uppercase letters + hyphen + digits) from title/branch
const issueKeyRegex = /[A-Z][A-Z0-9_]*-\d+/g;
export const extractJiraIssueKeys = pr => {
    const keys = new Set();
    const candidates = [];

    if (pr.title) candidates.push(pr.title);
    if (pr.head?.ref) candidates.push(pr.head.ref);

    candidates.forEach(str => {
        const matches = str.match(issueKeyRegex);
        if (matches) matches.forEach(k => keys.add(k));
    });
    return Array.from(keys);
}

const isNotApprovedBy = async (token, pr, owner) => {
    const response = await fetch(
        `${GITHUB_API_URL_BASE}/repos/${owner.toLowerCase()}/${pr.base.repo.name}/pulls/${pr.number}/reviews`,
        authHeadersFor(token)
    );
    if (!response.ok) {
        const text = await response.text().catch(() => response.statusText);
        throw new Error(`GitHub reviews request failed: ${response.status} ${text}`);
    }
    const reviews = await response.json();

    const ownerReviews = reviews.filter(review => review.user.login.toLowerCase() === owner.toLowerCase());
    const latestReview = ownerReviews
        .reduce((latest, current) =>
                new Date(current.submitted_at) > new Date(latest.submitted_at)
                    ? current
                    : latest,
            ownerReviews[0]);

    const isApprovedBy = latestReview && latestReview.state === 'APPROVED';
    return !isApprovedBy;
};


const mergePullRequestFromGithub = async (token, owner, name, prId) => {
    if (!token) throw new Error('GitHub token is required to merge pull requests');

    const response = await fetch(
        `${GITHUB_API_URL_BASE}/repos/${owner}/${name}/pulls/${prId}/merge`,
        {
            method: 'PUT',
            headers: authHeadersFor(token).headers
        }
    );
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.log("Merging PR failed:", response, "Response body:", data);
        throw new Error(data.message || 'Failed to merge pull request');
    }
    return await response.json();
}

const approvePullRequestFromGithub = async (token, owner, name, pullNumber) => {
    if (!token) throw new Error('GitHub token is required to merge pull requests');

    const response = await fetch(
        `${GITHUB_API_URL_BASE}/repos/${owner}/${name}/pulls/${pullNumber}/reviews`,
        {
            method: 'POST',
            headers: authHeadersFor(token).headers,
            body: JSON.stringify({event: 'APPROVE'})
        }
    );
    if (!response.ok) {
        const data = await response.json();
        console.log('Approve errors', data);
        throw new Error(data.errors.join('. '));
    }
    return await response.json();
}

const unapprovePullRequestFromGithub = async (token, owner, name, pullNumber) => {
    if (!token) throw new Error('GitHub token is required to merge pull requests');

    const response = await fetch(
        `${GITHUB_API_URL_BASE}/repos/${owner}/${name}/pulls/${pullNumber}/reviews`,
        {
            method: 'POST',
            headers: authHeadersFor(token).headers,
            body: JSON.stringify({event: 'REQUEST_CHANGES', body: 'Reverting previous approval'})
        }
    );
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.errors.join('. '));
    }
    return await response.json();
}

const whoAmI = async (token) => {
    const response = await fetch(
        `${GITHUB_API_URL_BASE}/user`,
        authHeadersFor(token)
    );
    if (!response.ok) {
        const text = await response.text().catch(() => response.statusText);
        throw new Error(`GitHub user request failed: ${response.status} ${text}`);
    }
    return await response.json();
}

const github = {
    repo: {
        listAll: listAllRepos,
    },
    pr: {
        listAllOpen: getAllOpenPullRequestFromGithub,
        merge: mergePullRequestFromGithub,
        approve: approvePullRequestFromGithub,
        unapprove: unapprovePullRequestFromGithub,
    },
    user : {
        whoAmI
    }
}

export default github;