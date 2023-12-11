const artifact = require('@actions/artifact');
const { OUTPUT_PATH, ARTIFACT_NAME } = process.env;

async function run() {
  try {
    const name = ARTIFACT_NAME;
    const resolvedPath = OUTPUT_PATH;

    console.info(`Resolved path is ${resolvedPath}`);
    const artifactClient = artifact.create();
    console.info(`Starting download for ${name}`);
    const downloadOptions = {
      createArtifactFolder: false,
    };
    const downloadResponse = await artifactClient.downloadArtifact(
      name,
      resolvedPath,
      downloadOptions
    );
    console.info(
      `Artifact ${downloadResponse.artifactName} was downloaded to ${downloadResponse.downloadPath}`
    );
  } catch (err) {
    console.error(err.message);
  }
}

run();
