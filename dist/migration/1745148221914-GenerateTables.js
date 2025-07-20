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
exports.GenerateTables1745148221914 = void 0;
class GenerateTables1745148221914 {
    constructor() {
        this.name = 'GenerateTables1745148221914';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "channel" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "isPrivate" boolean NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
            yield queryRunner.query(`CREATE INDEX "IDX_885f1a3a3369b4cfa36bfd2e83" ON "channel" ("workspaceId") `);
            yield queryRunner.query(`CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
            yield queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
            yield queryRunner.query(`CREATE TABLE "workspace_user" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
            yield queryRunner.query(`CREATE INDEX "IDX_ee0d54b3d049b16a596d0be61d" ON "workspace_user" ("userId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_c0c0d4527c85db43fce8740df6" ON "workspace_user" ("workspaceId") `);
            yield queryRunner.query(`DROP INDEX "IDX_885f1a3a3369b4cfa36bfd2e83"`);
            yield queryRunner.query(`CREATE TABLE "temporary_channel" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "isPrivate" boolean NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_885f1a3a3369b4cfa36bfd2e83f" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "temporary_channel"("id", "name", "isPrivate", "workspaceId", "createdAt", "updatedAt") SELECT "id", "name", "isPrivate", "workspaceId", "createdAt", "updatedAt" FROM "channel"`);
            yield queryRunner.query(`DROP TABLE "channel"`);
            yield queryRunner.query(`ALTER TABLE "temporary_channel" RENAME TO "channel"`);
            yield queryRunner.query(`CREATE INDEX "IDX_885f1a3a3369b4cfa36bfd2e83" ON "channel" ("workspaceId") `);
            yield queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
            yield queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
            yield queryRunner.query(`CREATE TABLE "temporary_message" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "channel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "temporary_message"("id", "content", "userId", "channelId", "createdAt", "updatedAt") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt" FROM "message"`);
            yield queryRunner.query(`DROP TABLE "message"`);
            yield queryRunner.query(`ALTER TABLE "temporary_message" RENAME TO "message"`);
            yield queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
            yield queryRunner.query(`DROP INDEX "IDX_ee0d54b3d049b16a596d0be61d"`);
            yield queryRunner.query(`DROP INDEX "IDX_c0c0d4527c85db43fce8740df6"`);
            yield queryRunner.query(`CREATE TABLE "temporary_workspace_user" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c0c0d4527c85db43fce8740df63" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "temporary_workspace_user"("id", "userId", "workspaceId", "createdAt") SELECT "id", "userId", "workspaceId", "createdAt" FROM "workspace_user"`);
            yield queryRunner.query(`DROP TABLE "workspace_user"`);
            yield queryRunner.query(`ALTER TABLE "temporary_workspace_user" RENAME TO "workspace_user"`);
            yield queryRunner.query(`CREATE INDEX "IDX_ee0d54b3d049b16a596d0be61d" ON "workspace_user" ("userId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_c0c0d4527c85db43fce8740df6" ON "workspace_user" ("workspaceId") `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX "IDX_c0c0d4527c85db43fce8740df6"`);
            yield queryRunner.query(`DROP INDEX "IDX_ee0d54b3d049b16a596d0be61d"`);
            yield queryRunner.query(`ALTER TABLE "workspace_user" RENAME TO "temporary_workspace_user"`);
            yield queryRunner.query(`CREATE TABLE "workspace_user" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
            yield queryRunner.query(`INSERT INTO "workspace_user"("id", "userId", "workspaceId", "createdAt") SELECT "id", "userId", "workspaceId", "createdAt" FROM "temporary_workspace_user"`);
            yield queryRunner.query(`DROP TABLE "temporary_workspace_user"`);
            yield queryRunner.query(`CREATE INDEX "IDX_c0c0d4527c85db43fce8740df6" ON "workspace_user" ("workspaceId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_ee0d54b3d049b16a596d0be61d" ON "workspace_user" ("userId") `);
            yield queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
            yield queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
            yield queryRunner.query(`ALTER TABLE "message" RENAME TO "temporary_message"`);
            yield queryRunner.query(`CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
            yield queryRunner.query(`INSERT INTO "message"("id", "content", "userId", "channelId", "createdAt", "updatedAt") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt" FROM "temporary_message"`);
            yield queryRunner.query(`DROP TABLE "temporary_message"`);
            yield queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
            yield queryRunner.query(`DROP INDEX "IDX_885f1a3a3369b4cfa36bfd2e83"`);
            yield queryRunner.query(`ALTER TABLE "channel" RENAME TO "temporary_channel"`);
            yield queryRunner.query(`CREATE TABLE "channel" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "isPrivate" boolean NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
            yield queryRunner.query(`INSERT INTO "channel"("id", "name", "isPrivate", "workspaceId", "createdAt", "updatedAt") SELECT "id", "name", "isPrivate", "workspaceId", "createdAt", "updatedAt" FROM "temporary_channel"`);
            yield queryRunner.query(`DROP TABLE "temporary_channel"`);
            yield queryRunner.query(`CREATE INDEX "IDX_885f1a3a3369b4cfa36bfd2e83" ON "channel" ("workspaceId") `);
            yield queryRunner.query(`DROP INDEX "IDX_c0c0d4527c85db43fce8740df6"`);
            yield queryRunner.query(`DROP INDEX "IDX_ee0d54b3d049b16a596d0be61d"`);
            yield queryRunner.query(`DROP TABLE "workspace_user"`);
            yield queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
            yield queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
            yield queryRunner.query(`DROP TABLE "message"`);
            yield queryRunner.query(`DROP INDEX "IDX_885f1a3a3369b4cfa36bfd2e83"`);
            yield queryRunner.query(`DROP TABLE "channel"`);
        });
    }
}
exports.GenerateTables1745148221914 = GenerateTables1745148221914;
