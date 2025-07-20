"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
exports.default = new typeorm_1.DataSource({
    migrationsTableName: 'migrations',
    type: 'sqlite',
    database: './data/slack-clone.sqlite',
    synchronize: false,
    migrationsRun: true,
    logging: ['query', 'error', 'log'],
    entities: [process.env.DB_TYPEORM_ENTITIES || 'src/**/*.entity.ts'],
    migrations: [process.env.DB_TYPEORM_MIGRATIONS || 'src/migration/**/*.ts'],
    subscribers: [process.env.DB_TYPEORM_SUBSCRIBERS || 'src/subscriber/**/*.ts'],
});
