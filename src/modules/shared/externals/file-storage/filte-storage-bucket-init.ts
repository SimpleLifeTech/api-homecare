import { S3Client, CreateBucketCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

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
