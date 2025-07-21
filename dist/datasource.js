"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const isProd = process.env.NODE_ENV === "production";
exports.default = new typeorm_1.DataSource({
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
