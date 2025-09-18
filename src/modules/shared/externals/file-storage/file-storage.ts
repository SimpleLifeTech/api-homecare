import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { StorageService } from './file-storage.client';
import { BucketType } from './filte-storage.types';

@Injectable()
export class FileStorage {
  constructor(private readonly storageService: StorageService) {}

  private readonly bucketMap: Record<BucketType, string> = {
    user_profile: process.env.USER_PROFILE_PHOTO_BUCKET as string,
    company_profile: process.env.COMPANY_PROFILE_PHOTO_BUCKET as string,
  };

  async uploadFile(
    bucketType: BucketType,
    fileKey: string,
    file: Express.Multer.File
  ) {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/heic",
      "image/heif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error("Tipo de arquivo inválido");
    }

    const bucketName = this.bucketMap[bucketType];
    const s3 = this.storageService.getClient();

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const baseUrl = process.env.MINIO_ENDPOINT as string;
      return `${baseUrl}/${bucketName}/${fileKey}`;
    } catch (error) {
      console.error(`Erro ao fazer upload para bucket ${bucketName}:`, error);
      throw new Error("Erro ao fazer upload do arquivo no MinIO");
    }
  }
}
