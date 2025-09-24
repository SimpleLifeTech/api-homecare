import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { StorageService } from './file-storage.client';
import { BucketType } from './filte-storage.types';

@Injectable()
export class FileStorage {
  constructor(private readonly storageService: StorageService) {}
  private readonly logger = new Logger(FileStorage.name);

  private readonly bucketMap: Record<BucketType, string> = {
    user_profile: process.env.USER_PROFILE_PHOTO_BUCKET as string,
    company_profile: process.env.COMPANY_PROFILE_PHOTO_BUCKET as string,
    employee_documents: process.env.EMPLOYEE_DOCUMENTS_BUCKET as string,
  };

  /**
   * Uploads a file to a specific bucket
   * 
   * @param bucketType - Bucket type to upload the file
   * @param file - File to upload
   * @returns file url
   */
  async uploadFile(
    bucketType: BucketType,
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

    const extension = file.originalname.split('.').pop();
    const fileKey = `${uuidv4()}.${extension}`;
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

      return `${bucketName}/${fileKey}`;
    } catch (error) {
      this.logger.error(`Erro ao fazer upload para bucket ${bucketName}:`, error);
      throw new Error("Erro ao fazer upload do arquivo");
    }
  }

  /**
   * Deletes a file
   * 
   * @param fileUrl - File url
   */
  async deleteFile(fileUrl: string) {
    const s3 = this.storageService.getClient();
    const [bucketName, fileKey] = fileUrl.split('/');
    
    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
        })
      )
    } catch (error) {
      this.logger.error(`Erro ao deletar o arquivo: ${bucketName}/${fileKey}`, error);
      throw new Error(`Erro ao deletar o arquivo: ${(error as Error).message}`);
    }
  }
}
