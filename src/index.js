const core = require("@actions/core");

async function main() {
  // main login executor
}

try {
  main();
} catch (err) {
  core.info(err);
  core.setFailed(err.message);
}
