import { Module } from "@nestjs/common";

import { FileStorage } from "./file-storage";
import { SupabaseService } from "./file-storage.client";

@Module({
  providers: [FileStorage, SupabaseService],
  exports: [FileStorage],
})
export class FileStorageModule {}
