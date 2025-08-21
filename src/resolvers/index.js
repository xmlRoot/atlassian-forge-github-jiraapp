import Resolver from '@forge/resolver';
import loginService from '../service/login';
import githubService from '../service/github';

const resolver = new Resolver();

const call = (target) => ({context, payload}) => {
    console.info("Calling", target, "context", context, "payload", payload);
    return target({accountId: context.accountId, ...payload});
};

// Token Service endpoints
resolver.define('getLoginData', call(loginService.getLoginData));
resolver.define('login', call(loginService.login));
resolver.define('logout', call(loginService.logout));
// Github Service endpoint
resolver.define('getAllRepositories', call(githubService.getAllRepositories));
resolver.define('getAllOpenPRs', call(githubService.getAllOpenPRs));
resolver.define('mergePR', call(githubService.mergePR));
resolver.define('approvePR', call(githubService.approvePR));
resolver.define('unapprovePR', call(githubService.unapprovePR));

export const resolvers = resolver.getDefinitions();
