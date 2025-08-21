import github from '../clients/github';
import storage from "../clients/storage";

const getLoginData = async ({accountId}) => {
    try {
        const [{token}, user] = await Promise.all(
            [
                storage.github.get(accountId),
                storage.user.get(accountId)
            ]
        );
        console.log('Fetched token from DB:', token);
        console.log('Fetched user from DB:', user);
        // TODO: use githubClient to fetch user data, instead of hardcoding
        return {token, user};
    } catch (error) {
        console.error("Couldn't fetch token from DB:", storage.github.generateKey(accountId));
        return {token: null};
    }
};

const validate = async token => {
    if (!token || token.length < 40) {
        throw Error("Token should contain at least 40 characters");
    }
    return true;
}

const saveGithubApiToken = async ({accountId, token}) => {
    // do validate
    const isValid = await validate(token);
    if (!isValid) {
        return {ok: false, message: "Token is invalid"};
    }
    const user = await github.user.whoAmI(token);
    if (!user) {
        return {ok: false, message: "Token cannot authenticate with GitHub"};
    }
    try {
        await Promise.all([
            storage.github.set(accountId, token),
            storage.user.set(accountId, {login: user.login})
        ])
        return {ok: true, user: user.login};
    } catch (error) {
        console.error('Couldn\'t save token in DB:', storage.github.generateKey(accountId));
        return {ok: false, message: error.message};
    }
};

const deleteGithubApiToken = async ({accountId}) => {
    try {
        const result = await storage.github.remove(accountId);
        console.log('Deleted token from DB:', result);
        return {ok: true};
    } catch (error) {
        console.error('Couldn\'t delete token in DB:', storage.github.generateKey(accountId));
        return {ok: false, message: error.message};
    }
};

const loginService = {
    getLoginData,
    login: saveGithubApiToken,
    logout: deleteGithubApiToken,
}

export default loginService;