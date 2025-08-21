import { invoke } from "@forge/bridge";

export const getAllRepositories = (token) => {
  return invoke('getAllRepositories', { token })
    .then(data => {
      console.log('getAllRepositories(token) backend response:', data);
      return data;
    });
};

export const getAllOpenPRs = async (token, owner, name) => {
  return invoke('getAllOpenPRs', { token, owner, name })
    .then(async data => {
      console.log('getAllOpenPRs(token, owner, name) backend response:', data);
      return data;
    });
};
