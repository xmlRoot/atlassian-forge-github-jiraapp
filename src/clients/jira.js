const ISSUE_KEY_REGEX = /[A-Z][A-Z0-9_]*-\d+/g;

const extractKeysFromText = (text) => {
    const keys = new Set();
    const matches = text.match(ISSUE_KEY_REGEX);
    if (matches) matches.forEach(k => keys.add(k));

    return Array.from(keys);
};

const jira = {
    extractKeysFromText,
}

export default jira;