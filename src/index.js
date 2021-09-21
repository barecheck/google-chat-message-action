const core = require("@actions/core");
const {
  getStatus,
  getAppName,
  getWebhookUrl,
  getDescription
} = require("./input");
const { sendMessage } = require("./services/googleChat");

async function main() {
  const status = getStatus();
  const appName = getAppName();
  const webhookUrl = getWebhookUrl();
  const description = getDescription();

  await sendMessage(appName, description, webhookUrl, status);
}

try {
  main();
} catch (err) {
  core.info(err);
  core.setFailed(err.message);
}
