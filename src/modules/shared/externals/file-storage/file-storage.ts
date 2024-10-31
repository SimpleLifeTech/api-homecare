import { Injectable } from "@nestjs/common";
import { OriginBucket } from "./filte-storage.types";
import { SupabaseService } from "./file-storage.client";

@Injectable()
export class FileStorage {
  constructor(private readonly supabaseService: SupabaseService) {}

  private readonly bucketName = process.env.SUPABASE_BUCKET as string;

  async uploadImage(id: string, origin: OriginBucket, file: Express.Multer.File) {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/heic",
      "image/heif",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error("Tipo de imagem inválido");
    }

    const supabase = this.supabaseService.getClient();
    const fileName = `${origin}/${file.originalname + id}`;

    const { error } = await supabase.storage.from(this.bucketName).upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

    if (error) {
      throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
    }

    return `${process.env.SUPABASE_URL}/storage/v1/object/public/imagens/${fileName}`;
  }
}
