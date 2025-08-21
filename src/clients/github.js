import api from '@forge/api';

export const isValidToken = async (token) => {
  const response = await fetchRepositories(token);
  return response.ok;
}

const fetchRepositories = async (token) => {
    if (!token) throw new Error('GitHub token is required to list repositories');
    console.log("Fetching Github Repositories")
    const response = await api.fetch('https://api.github.com/user/repos?per_page=100', {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });
    console.log("Fetched Github repositories OK:", response.ok)
    return response;
}

export const getAllRepositoriesFromGithub = async (token) => {
  const response = await fetchRepositories(token);
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`GitHub repository request failed: ${response.status} ${text}`);
  }
  return await response.json();
}

export const getAllOpenPullRequestFromGithub = async (token, owner, name) => {
  if (!token) throw new Error('GitHub token is required to list pull requests');
  if (!owner) throw new Error('Repository owner is required to list pull requests');
  if (!name) throw new Error('Repository name is required to list pull requests');

  const onlySearchForPrsInState = 'open';
  const pageLimit = '100';
  const response = await api.fetch(
    `https://api.github.com/repos/${owner.toUpperCase()}/${name.toUpperCase()}/pulls?state=${onlySearchForPrsInState}&per_page=${pageLimit}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json'
      }
    }
  );
  
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`GitHub pull requests request failed: ${response.status} ${text}`);
  }

  const prs = await response.json();

  // Extract JIRA keys (uppercase letters + hyphen + digits) from title/branch
  const issueKeyRegex = /[A-Z][A-Z0-9_]*-\d+/g;
  return prs.map(pr => {
    const keys = new Set();
    const candidates = [];
    if (pr.title) candidates.push(pr.title);
    if (pr.head && pr.head.ref) candidates.push(pr.head.ref);
    candidates.forEach(str => {
      const matches = str.match(issueKeyRegex);
      if (matches) matches.forEach(k => keys.add(k));
    });
    return {
      ...pr,
      issueKeys: Array.from(keys)
    };
  });
}


export const mergePullRequestFromGithub = async (token, repository, pullNumber, options = {}) => {
  if (!token) throw new Error('GitHub token is required to merge pull requests');
  let owner, name;
  if (typeof repository === 'string') {
    [owner, name] = repository.split('/');
  } else {
    owner = repository.owner;
    name = repository.name;
  }
  const response = await api.fetch(
    `https://api.github.com/repos/${owner}/${name}/pulls/${pullNumber}/merge`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    }
  );
  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new Error(`GitHub merge request failed: ${response.status} ${text}`);
  }
  return await response.json();
}