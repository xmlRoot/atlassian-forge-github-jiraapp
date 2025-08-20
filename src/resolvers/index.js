import Resolver from '@forge/resolver';
import { getGithubApiToken, saveGithubApiToken, deleteGithubApiToken } from '../services/token';

const resolver = new Resolver();

// Token Service endpoints
resolver.define('getGithubApiToken', getGithubApiToken);
resolver.define('saveGithubApiToken', saveGithubApiToken);
resolver.define('deleteGithubApiToken', deleteGithubApiToken);

export const handler = resolver.getDefinitions();
