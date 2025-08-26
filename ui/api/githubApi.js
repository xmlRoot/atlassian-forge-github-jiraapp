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
      return data ? data : [];
    });
};

export const mergePR = async (token, owner, name, prId) => {
  return invoke('mergePR', { token, owner, name, prId })
    .then(async data => {
      console.log('mergePR(token, owner, name, prId) backend response:', data);
      return data;
    });
};

export const approvePR = async (token, owner, name, prId) => {
  return invoke('approvePR', { token, owner, name, prId })
    .then(async data => {
      console.log('approvePR(token, owner, name, prId) backend response:', data);
      return data;
    });
};

export const unapprovePR = async (token, owner, name, prId) => {
  return invoke('unapprovePR', { token, owner, name, prId })
    .then(async data => {
      console.log('unapprovePR(token, owner, name, prId) backend response:', data);
      return data;
    });
};