import {kvs} from "@forge/kvs";

const generateTokenKey = (accountId) => `github-token:${accountId}`;
const generateUserKey = (accountId) => `github-user:${accountId}`;

const getGithubToken = async (accountId) => {
    const token = await kvs.getSecret(generateTokenKey(accountId));
    return {token};
}

const setGithubToken = async (accountId, token) => {
    await kvs.setSecret(generateTokenKey(accountId), token);
    return {success: true};
}

const removeGithubToken = async (accountId, token) => {
    return await kvs.deleteSecret(generateTokenKey(accountId));
}

const getUserInfo = async (accountId) => {
    return await kvs.getSecret(generateUserKey(accountId));
}

const deleteUserInfo = async (accountId) => {
    return await kvs.deleteSecret(generateUserKey(accountId));
}

const setUserInfo = async (accountId, user) => {
    return await kvs.setSecret(generateUserKey(accountId), user);
}

const storage = {
    github: {
        set: setGithubToken,
        get: getGithubToken,
        remove: removeGithubToken,
        generateKey: generateTokenKey,
    },
    user : {
        get: getUserInfo,
        set: setUserInfo,
        delete: deleteUserInfo,
    }
}

export default storage;