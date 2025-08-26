import Resolver from '@forge/resolver';
import { getLoginData, saveGithubApiToken, deleteGithubApiToken } from '../services/login';
import { getAllRepositories, getAllOpenPRs, mergePR, approvePR, unapprovePR } from '../services/github';

const resolver = new Resolver();

// Token Service endpoints
resolver.define('getLoginData', getLoginData);
resolver.define('saveGithubApiToken', saveGithubApiToken);
resolver.define('deleteGithubApiToken', deleteGithubApiToken);
// Github Service endpoint
resolver.define('getAllRepositories', getAllRepositories);
resolver.define('getAllOpenPRs', getAllOpenPRs);
resolver.define('mergePR', mergePR);
resolver.define('approvePR', approvePR);
resolver.define('unapprovePR', unapprovePR);

export const resolvers = resolver.getDefinitions();
