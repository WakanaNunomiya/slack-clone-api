import { DataSource } from "typeorm";

const isProd = process.env.NODE_ENV === "production";

export default new DataSource({
  migrationsTableName: "migrations",
  type: "sqlite",
  database: "./data/slack-clone.sqlite",
  synchronize: false,
  migrationsRun: true,
  logging: ["query", "error", "log"],
  entities: [isProd ? "dist/**/*.entity.js" : "src/**/*.entity.ts"],
  migrations: [isProd ? "dist/migration/**/*.js" : "src/migration/**/*.ts"],
  subscribers: [isProd ? "dist/subscriber/**/*.js" : "src/subscriber/**/*.ts"],
});
