import "dotenv/config"
import "reflect-metadata"

import { DataSource } from "typeorm"

import models from "../modules/models"

export const databaseProviders = [
  {
    provide: "DATA_SOURCE",
    useFactory: async () => {
      const dataSource = new DataSource({
        type: "postgres",
        host: process.env.CONNECTION_HOST,
        port: Number(process.env.CONNECTION_PORT) || 5432,
        username: process.env.CONNECTION_USER,
        password: process.env.CONNECTION_PASSWORD,
        database: process.env.CONNECTION_DB,
        synchronize: false,
        entities: models,
      })

      return dataSource
        .initialize()
        .then(() => {
          console.log("✅ Data Source has been initialized!")
        })
        .catch((err) => {
          console.error("❌ Error during Data Source initialization", err)
        })
    },
  },
]
