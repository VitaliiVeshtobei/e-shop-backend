import { S3Client, DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const awsBucketName = process.env.AWS_BUCKET_NAME;
const awsBucketRegion = process.env.AWS_BUCKET_REGION;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: awsAccessKey || '',
    secretAccessKey: awsSecretKey || '',
  },
  region: awsBucketRegion,
});

export const deletePhoto = async (categories) => {
  categories.forEach(async (category) => {
    const params = {
      Bucket: awsBucketName,
      Key: category.image,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
  });
};

export const getPhotoUrl = async (name) => {
  const getObjectParams = {
    Bucket: awsBucketName,
    Key: name,
  };

  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
};

export const uploadPhoto = async (file) => {
  const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

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
