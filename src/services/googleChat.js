const github = require("@actions/github");
const axios = require("axios");

const statusColorPalette = {
  success: "#2cbe4e",
  cancelled: "#ffc107",
  failure: "#ff0000"
};

const statusText = {
  success: "Succeeded",
  cancelled: "Cancelled",
  failure: "Failed"
};

const textButton = (text, url) => ({
  textButton: {
    text,
    onClick: { openLink: { url } }
  }
});

const getMessageBody = (name, url, status) => {
  const { owner, repo } = github.context.repo;
  const { eventName, sha, ref } = github.context;
  const { number } = github.context.issue;
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const eventPath =
    eventName === "pull_request" ? `/pull/${number}` : `/commit/${sha}`;
  const eventUrl = `${repoUrl}${eventPath}`;
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
                  topLabel: "event name",
                  content: eventName,
                  button: textButton("OPEN EVENT", eventUrl)
                }
              },
              {
                keyValue: { topLabel: "ref", content: ref }
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

const sendMessage = async (name, url, status) => {
  const body = getMessageBody(name, url, status);

  const response = await axios.default.post(url, body);
  if (response.status !== 200) {
    throw new Error(
      `Google Chat notification failed. response status=${response.status}`
    );
  }
};

module.exports = {
  sendMessage
};
