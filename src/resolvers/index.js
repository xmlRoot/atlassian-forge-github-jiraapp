import Resolver from '@forge/resolver';
import { kvs } from '@forge/kvs';

const GITHUB_API_TOKEN_KEY = 'github-api-token';

const resolver = new Resolver();

resolver.define('getGithubApiToken', async () => {
  try {
    const token = await kvs.getSecret(GITHUB_API_TOKEN_KEY);
    console.log('Fetched token from DB:', token);
    return token;
  } catch(error) {
    console.error('Couldn\'t fetch token from DB:', GITHUB_API_TOKEN_KEY);
    return null;
  }
});

const validateToken = token => {
  if (!token || token.length < 40) {
    throw Error("Token should contain at least 40 characters");
  }
}

resolver.define('saveGithubApiToken', async ({ payload }) => {
  console.log('saveGithubApiToken parameters:', payload);
  const { token } = payload;
  try {
    validateToken(token);
    const result = await kvs.setSecret(GITHUB_API_TOKEN_KEY, token);
    console.log('Saved token in DB:', result);
    return { ok: true };
  } catch(error) {
    console.error('Couldn\'t save token in DB:', GITHUB_API_TOKEN_KEY);
    return { ok: false, message: error.message };
  }
});

resolver.define('deleteGithubApiToken', async () => {
  try {
    const result = await kvs.deleteSecret(GITHUB_API_TOKEN_KEY);
    console.log('Deleted token from DB:', result);
    return { ok: true };
  } catch(error) {
    console.error('Couldn\'t delete token in DB:', GITHUB_API_TOKEN_KEY);
    return { ok: false, message: error.message };
  }
});


export const handler = resolver.getDefinitions();
