import { kvs } from '@forge/kvs';
import { isValidToken } from '../clients/github';

const GITHUB_API_TOKEN_KEY = 'github-api-token';

export const getGithubApiToken = async () => {
  try {
    const token = await kvs.getSecret(GITHUB_API_TOKEN_KEY);
    console.log('Fetched token from DB:', token);
    return token;
  } catch(error) {
    console.error('Couldn\'t fetch token from DB:', GITHUB_API_TOKEN_KEY);
    return null;
  }
};

const validateToken = async token => {
  if (!token || token.length < 40) {
    return Error("Token should contain at least 40 characters");
  } 
  const isValid = await isValidToken(token);
  if (!isValid) {
    return Error("Token cannot authenticate with GitHub");
  }

  return null;
}

export const saveGithubApiToken = async ({ payload }) => {
  console.log('saveGithubApiToken parameters:', payload);
  const { token } = payload;
  const error = await validateToken(token);
  if (error) {
    return { ok: false, message: error.message };
  }

  try {
    const result = await kvs.setSecret(GITHUB_API_TOKEN_KEY, token);
    console.log('Saved token in DB:', result);
    return { ok: true };
  } catch(error) {
    console.error('Couldn\'t save token in DB:', GITHUB_API_TOKEN_KEY);
    return { ok: false, message: error.message };
  }
};

export const deleteGithubApiToken = async () => {
  try {
    const result = await kvs.deleteSecret(GITHUB_API_TOKEN_KEY);
    console.log('Deleted token from DB:', result);
    return { ok: true };
  } catch(error) {
    console.error('Couldn\'t delete token in DB:', GITHUB_API_TOKEN_KEY);
    return { ok: false, message: error.message };
  }
};
