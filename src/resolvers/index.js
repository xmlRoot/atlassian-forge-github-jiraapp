import Resolver from '@forge/resolver';
import { getGithubApiToken, saveGithubApiToken, deleteGithubApiToken } from '../services/token';
import { getAllRepositories, getAllOpenPRs } from '../services/github';

const resolver = new Resolver();

// Token Service endpoints
resolver.define('getGithubApiToken', getGithubApiToken);
resolver.define('saveGithubApiToken', saveGithubApiToken);
resolver.define('deleteGithubApiToken', deleteGithubApiToken);
// Github Service endpoint
resolver.define('getAllRepositories', getAllRepositories);
resolver.define('getAllOpenPRs', getAllOpenPRs);

export const handler = resolver.getDefinitions();
