import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const awsBucketName = process.env.AWS_BUCKET_NAME;
const awsBucketRegion = process.env.AWS_BUCKET_REGION;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;

export const uploadPhoto = async (file) => {
  const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

  const s3 = new S3Client({
    credentials: {
      accessKeyId: awsAccessKey || '',
      secretAccessKey: awsSecretKey || '',
    },
    region: awsBucketRegion,
  });
  const randomName = randomImageName();
  const params = {
    Bucket: awsBucketName,
    Key: randomName,
    Body: file.buffer,
    ContentTyoe: file.mimetype,
  };

  const comand = new PutObjectCommand(params);
  await s3.send(comand);
  return randomName;
};
