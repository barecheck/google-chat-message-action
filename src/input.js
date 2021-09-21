const core = require("@actions/core");

const parseStatus = (status) => {
  const s = status.toLowerCase();
  switch (s) {
    case "success":
    case "failure":
    case "inProgress":
      return s;
    default:
      throw Error(`Invalid parameter. status=${status}.`);
  }
};

const getStatus = () => {
  const inputStatus = core.getInput("status");

  return parseStatus(inputStatus);
};

const getAppName = () => {
  const appNameInput = core.getInput("app_name");

  return appNameInput;
};

const getDescription = () => {
  const description = core.getInput("description");

  return description;
};

const getWebhookUrl = () => {
  const webhookUrl = core.getInput("webhook_url");

  return webhookUrl;
};

module.exports = {
  getStatus,
  getAppName,
  getWebhookUrl,
  getDescription
};
