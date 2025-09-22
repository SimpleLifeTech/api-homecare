import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>("MINIO_REGION") ?? "us-east-1",
      endpoint: this.configService.get<string>("MINIO_ENDPOINT"),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get<string>("MINIO_ROOT_USER"),
        secretAccessKey: this.configService.get<string>("MINIO_ROOT_PASSWORD"),
      },
    });
  }

  /**
   * Method to get the S3 client instance.
   * 
   * @returns The S3 client instance
   */
  getClient(): S3Client {
    return this.s3;
  }
}
