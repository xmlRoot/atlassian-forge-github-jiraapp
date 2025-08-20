# Forge Github Link app

This project contains a Forge app with two screens:

1) The first one is an auth with a field for saving your Github API token to storage

2) The second one is connected screen with main functionality.

On the Connected screen gets your repositories from GitHub (renders a list of the repositories) and gets full information about your repository (name, language, etc.), and an opened pull request that is related to the task from the Jira board. If you don’t have any open pull requests related to the task, renders empty state for it (Have no opened pull requests). If you have an opened pull requests, show it in the card with repository information, with a link to the GitHub site with PR. Also, add an option to approve and merge this PR and show it in the card with repository information. If PR is merged, change the status of the Jira ticket to Done (use webhooks to check if is PR merged, and in the webtrigger handler, change the Jira ticket status).

Parse PR name or branch name to get a key that relates to the task name. For example task has a key KAN-1 and a PR name KAN-1: first-commit.

## Quick start

- Build and deploy your app by running:
```
forge deploy
```

- Install your app in an Atlassian site by running:
```
forge install --upgrade -p Jira -s atlassiandevhub.atlassian.net
```

- Develop your app by running `forge tunnel` to proxy invocations locally:
```
forge tunnel
```

