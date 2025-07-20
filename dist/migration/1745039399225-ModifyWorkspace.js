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
exports.ModifyWorkspace1745039399225 = void 0;
class ModifyWorkspace1745039399225 {
    constructor() {
        this.name = 'ModifyWorkspace1745039399225';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "temporary_workspace" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "adminUserId" varchar NOT NULL)`);
            yield queryRunner.query(`INSERT INTO "temporary_workspace"("id", "name", "createdAt", "updatedAt") SELECT "id", "name", "createdAt", "updatedAt" FROM "workspace"`);
            yield queryRunner.query(`DROP TABLE "workspace"`);
            yield queryRunner.query(`ALTER TABLE "temporary_workspace" RENAME TO "workspace"`);
            yield queryRunner.query(`CREATE INDEX "IDX_e1b802b7f9f6f600162cb1c073" ON "workspace" ("adminUserId") `);
            yield queryRunner.query(`DROP INDEX "IDX_e1b802b7f9f6f600162cb1c073"`);
            yield queryRunner.query(`CREATE TABLE "temporary_workspace" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "adminUserId" varchar NOT NULL, CONSTRAINT "FK_e1b802b7f9f6f600162cb1c073d" FOREIGN KEY ("adminUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
            yield queryRunner.query(`INSERT INTO "temporary_workspace"("id", "name", "createdAt", "updatedAt", "adminUserId") SELECT "id", "name", "createdAt", "updatedAt", "adminUserId" FROM "workspace"`);
            yield queryRunner.query(`DROP TABLE "workspace"`);
            yield queryRunner.query(`ALTER TABLE "temporary_workspace" RENAME TO "workspace"`);
            yield queryRunner.query(`CREATE INDEX "IDX_e1b802b7f9f6f600162cb1c073" ON "workspace" ("adminUserId") `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP INDEX "IDX_e1b802b7f9f6f600162cb1c073"`);
            yield queryRunner.query(`ALTER TABLE "workspace" RENAME TO "temporary_workspace"`);
            yield queryRunner.query(`CREATE TABLE "workspace" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "adminUserId" varchar NOT NULL)`);
            yield queryRunner.query(`INSERT INTO "workspace"("id", "name", "createdAt", "updatedAt", "adminUserId") SELECT "id", "name", "createdAt", "updatedAt", "adminUserId" FROM "temporary_workspace"`);
            yield queryRunner.query(`DROP TABLE "temporary_workspace"`);
            yield queryRunner.query(`CREATE INDEX "IDX_e1b802b7f9f6f600162cb1c073" ON "workspace" ("adminUserId") `);
            yield queryRunner.query(`DROP INDEX "IDX_e1b802b7f9f6f600162cb1c073"`);
            yield queryRunner.query(`ALTER TABLE "workspace" RENAME TO "temporary_workspace"`);
            yield queryRunner.query(`CREATE TABLE "workspace" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
            yield queryRunner.query(`INSERT INTO "workspace"("id", "name", "createdAt", "updatedAt") SELECT "id", "name", "createdAt", "updatedAt" FROM "temporary_workspace"`);
            yield queryRunner.query(`DROP TABLE "temporary_workspace"`);
        });
    }
}
exports.ModifyWorkspace1745039399225 = ModifyWorkspace1745039399225;
