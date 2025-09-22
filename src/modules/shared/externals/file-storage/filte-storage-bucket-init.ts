import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

/**
 * Function to initialize required S3 buckets if they do not exist.
 * 
 * @param s3 - The S3 client instance
 * @param config - The configuration service instance
 */
export async function initBuckets(s3: S3Client, config: ConfigService) {
  const buckets = [
    config.get<string>('USER_PROFILE_PHOTO_BUCKET'),
    config.get<string>('COMPANY_PROFILE_PHOTO_BUCKET'),
  ];

  for (const bucket of buckets) {
    if (!bucket) continue;
    try {
      await s3.send(new CreateBucketCommand({ Bucket: bucket }));
      console.log(`✅ Bucket criado: ${bucket}`);
    } catch (e: any) {
      if (e.$metadata?.httpStatusCode === 409) {
        console.log(`ℹ️ Bucket já existe: ${bucket}`);
      } else {
        console.error(`❌ Erro ao criar bucket ${bucket}`, e);
      }
    }
  }
}
