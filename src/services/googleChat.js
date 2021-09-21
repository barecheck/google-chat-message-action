const github = require("@actions/github");
const axios = require("axios");

const statusColorPalette = {
  success: "#2cbe4e",
  inProgress: "#ffc107",
  failure: "#ff0000"
};

const statusText = {
  success: "Succeeded",
  inProgress: "In Progress",
  failure: "Failed"
};

const textButton = (text, url) => ({
  textButton: {
    text,
    onClick: { openLink: { url } }
  }
});

const getDescriptionWidget = (description) => {
  const exists = description.match("\\(\\#(.*)\\)");

  if (exists !== null) {
    const number = parseInt(exists[1], 10);
    const { owner, repo } = github.context.repo;
    const repoUrl = `https://github.com/${owner}/${repo}`;
    const pullRequestLink = `${repoUrl}/pull/${number}`;
    // TODO: clean up description

    return {
      content: description,
      button: textButton("OPEN", pullRequestLink)
    };
  }

  return {
    content: description
  };
};

const getMessageBody = (name, description, status) => {
  const { owner, repo } = github.context.repo;
  const { eventName, sha } = github.context;
  const { number } = github.context.issue;
  const repoUrl = `https://github.com/${owner}/${repo}`;

  const eventPath =
    eventName === "pull_request" ? `/pull/${number}` : `/commit/${sha}`;
  const checksUrl = `${repoUrl}${eventPath}/checks`;

  const body = {
    cards: [
      {
        sections: [
          {
            widgets: [
              {
                textParagraph: {
                  text: `<b>${name} <font color="${statusColorPalette[status]}">${statusText[status]}</font></b>`
                }
              }
            ]
          },
          {
            widgets: [
              {
                keyValue: {
                  topLabel: "repository",
                  content: `${owner}/${repo}`,
                  contentMultiline: true,
                  button: textButton("OPEN REPOSITORY", repoUrl)
                }
              },
              {
                keyValue: {
                  topLabel: "Description",
                  ...getDescriptionWidget(description)
                }
              }
            ]
          },
          {
            widgets: [
              {
                buttons: [textButton("OPEN CHECKS", checksUrl)]
              }
            ]
          }
        ]
      }
    ]
  };

  return body;
};

const sendMessage = async (name, description, webhookUrl, status) => {
  const body = getMessageBody(name, description, status);

  const response = await axios.default.post(webhookUrl, body);
  if (response.status !== 200) {
    throw new Error(
      `Google Chat notification failed. response status=${response.status}`
    );
  }
};

module.exports = {
  sendMessage
};
