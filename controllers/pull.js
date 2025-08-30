const fs = require('fs').promises;
const path = require('path');
const { s3, S3_BUCKET } = require('../config/aws-config');
const { ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');

async function pullChanges() {
  const repoPath = path.resolve(process.cwd(), '.apnaGit');
  const commitsPath = path.join(repoPath, 'commits');

  try {
    // List objects in the bucket
    const listCommand = new ListObjectsV2Command({ Bucket: S3_BUCKET, Prefix: 'commits/' });
    const data = await s3.send(listCommand);

    if (!data.Contents || data.Contents.length === 0) {
      console.log('No files found in S3 bucket.');
      return;
    }

    // Download each file
    for (const obj of data.Contents) {
      const key = obj.Key;
      const filePath = path.join(repoPath, key); // local path

      // Create directories if they don't exist
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      const getCommand = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
      const fileData = await s3.send(getCommand);

      // Convert stream to buffer
      const chunks = [];
      for await (const chunk of fileData.Body) {
        chunks.push(chunk);
      }
      await fs.writeFile(filePath, Buffer.concat(chunks));

      console.log(`Downloaded: ${key}`);
    }

    console.log('All files pulled from S3 successfully!');
  } catch (err) {
    console.error('Unable to pull:', err);
  }
}

module.exports = { pullChanges };
