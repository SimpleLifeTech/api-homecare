import { Module } from "@nestjs/common";

import { FileStorage } from "./file-storage";
import { StorageService } from "./file-storage.client";

@Module({
  providers: [FileStorage, StorageService],
  exports: [FileStorage],
})
export class FileStorageModule {}
