import { invoke } from "@forge/bridge";

const isValidToken = (value) => {
  return (
    typeof value === 'string' && // Check if it's a string
    value !== null &&            // Ensure it's not null
    value !== undefined &&       // Ensure it's not undefined
    value.trim() !== ''          // Ensure it's not empty or whitespace-only
  );
}

export const getToken = () => {
  return invoke('getGithubApiToken')
            .then(result => isValidToken(result) ? result : null);
};

export const login = (token) => {
  return invoke('saveGithubApiToken', { token });
};

export const logout = async () => {
  return invoke('deleteGithubApiToken');
};
