import S3 from "aws-sdk/clients/s3.js";
import config from "config";

const s3Client = new S3({
  region: "ap-south-1",
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});

export { s3Client };
