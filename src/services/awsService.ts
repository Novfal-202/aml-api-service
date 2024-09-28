import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { appConfiguration } from '../config';

const { bucketName, presignedUrlExpiry, awsRegion } = appConfiguration;

const s3Client = new S3Client({ region: awsRegion });

export const getPresignedUrl = async (fileName: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: presignedUrlExpiry,
  });
  return {
    error: !url,
    url,
    message: url ? 'success' : 'error getting signed url',
    expiresInSec: presignedUrlExpiry,
  };
};

export const uploadUrl = async (folderName: string, category: string, fileName: string) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `${folderName}/${category}/${fileName}`,
  });
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: presignedUrlExpiry,
  });
  return {
    error: !url,
    url,
    message: url ? 'success' : 'error getting signed url',
    expiresInSec: presignedUrlExpiry,
  };
};
