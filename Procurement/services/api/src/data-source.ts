import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "datasage",
  entities: [User],
  synchronize: true
});