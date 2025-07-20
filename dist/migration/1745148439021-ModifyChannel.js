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
exports.ModifyChannel1745148439021 = void 0;
class ModifyChannel1745148439021 {
    constructor() {
        this.name = 'ModifyChannel1745148439021';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX "IDX_885f1a3a3369b4cfa36bfd2e83"`);
            yield queryRunner.query(`CREATE TABLE "temporary_channel" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_885f1a3a3369b4cfa36bfd2e83f" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "temporary_channel"("id", "name", "workspaceId", "createdAt", "updatedAt") SELECT "id", "name", "workspaceId", "createdAt", "updatedAt" FROM "channel"`);
            yield queryRunner.query(`DROP TABLE "channel"`);
            yield queryRunner.query(`ALTER TABLE "temporary_channel" RENAME TO "channel"`);
            yield queryRunner.query(`CREATE INDEX "IDX_885f1a3a3369b4cfa36bfd2e83" ON "channel" ("workspaceId") `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX "IDX_885f1a3a3369b4cfa36bfd2e83"`);
            yield queryRunner.query(`ALTER TABLE "channel" RENAME TO "temporary_channel"`);
            yield queryRunner.query(`CREATE TABLE "channel" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "isPrivate" boolean NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_885f1a3a3369b4cfa36bfd2e83f" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "channel"("id", "name", "workspaceId", "createdAt", "updatedAt") SELECT "id", "name", "workspaceId", "createdAt", "updatedAt" FROM "temporary_channel"`);
            yield queryRunner.query(`DROP TABLE "temporary_channel"`);
            yield queryRunner.query(`CREATE INDEX "IDX_885f1a3a3369b4cfa36bfd2e83" ON "channel" ("workspaceId") `);
        });
    }
}
exports.ModifyChannel1745148439021 = ModifyChannel1745148439021;
