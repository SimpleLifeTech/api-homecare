import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient as StorageClient } from "@supabase/supabase-js";

@Injectable()
export class StorageService {
  private storage: StorageClient;

  constructor(private configService: ConfigService) {
    this.storage = createClient(
      this.configService.get<string>("SUPABASE_URL"),
      this.configService.get<string>("SUPABASE_KEY"),
    );
  }

  getClient(): StorageClient {
    return this.storage;
  }
}
