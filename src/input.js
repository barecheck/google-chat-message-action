const core = require("@actions/core");

const getBarecheckGithubAppToken = () =>
  core.getInput("barecheck-github-app-token");

module.exports = {
  getBarecheckGithubAppToken
};
