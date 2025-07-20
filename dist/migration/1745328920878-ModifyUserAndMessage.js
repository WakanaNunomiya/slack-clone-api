"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyUserAndMessage1745328920878 = void 0;
class ModifyUserAndMessage1745328920878 {
    constructor() {
        this.name = 'ModifyUserAndMessage1745328920878';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
            yield queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
            yield queryRunner.query(`CREATE TABLE "temporary_message" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageUrl" varchar, CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "channel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "temporary_message"("id", "content", "userId", "channelId", "createdAt", "updatedAt") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt" FROM "message"`);
            yield queryRunner.query(`DROP TABLE "message"`);
            yield queryRunner.query(`ALTER TABLE "temporary_message" RENAME TO "message"`);
            yield queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
            yield queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
            yield queryRunner.query(`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "thumbnailUrl" varchar)`);
            yield queryRunner.query(`INSERT INTO "temporary_user"("id", "name", "email", "password", "createdAt", "updatedAt") SELECT "id", "name", "email", "password", "createdAt", "updatedAt" FROM "user"`);
            yield queryRunner.query(`DROP TABLE "user"`);
            yield queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
            yield queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
            yield queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
            yield queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
            yield queryRunner.query(`CREATE TABLE "temporary_message" ("id" varchar PRIMARY KEY NOT NULL, "content" text, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageUrl" varchar, CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "channel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "temporary_message"("id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl" FROM "message"`);
            yield queryRunner.query(`DROP TABLE "message"`);
            yield queryRunner.query(`ALTER TABLE "temporary_message" RENAME TO "message"`);
            yield queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
            yield queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
            yield queryRunner.query(`ALTER TABLE "message" RENAME TO "temporary_message"`);
            yield queryRunner.query(`CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageUrl" varchar, CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "channel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "message"("id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl" FROM "temporary_message"`);
            yield queryRunner.query(`DROP TABLE "temporary_message"`);
            yield queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
            yield queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
            yield queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
            yield queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
            yield queryRunner.query(`INSERT INTO "user"("id", "name", "email", "password", "createdAt", "updatedAt") SELECT "id", "name", "email", "password", "createdAt", "updatedAt" FROM "temporary_user"`);
            yield queryRunner.query(`DROP TABLE "temporary_user"`);
            yield queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
            yield queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
            yield queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
            yield queryRunner.query(`ALTER TABLE "message" RENAME TO "temporary_message"`);
            yield queryRunner.query(`CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "channel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "message"("id", "content", "userId", "channelId", "createdAt", "updatedAt") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt" FROM "temporary_message"`);
            yield queryRunner.query(`DROP TABLE "temporary_message"`);
            yield queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
        });
    }
}
exports.ModifyUserAndMessage1745328920878 = ModifyUserAndMessage1745328920878;
