"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceUser = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const workspace_entity_1 = require("../workspaces/workspace.entity");
let WorkspaceUser = class WorkspaceUser {
};
exports.WorkspaceUser = WorkspaceUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorkspaceUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WorkspaceUser.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.workspaceUsers),
    (0, typeorm_1.Index)(),
    __metadata("design:type", user_entity_1.User)
], WorkspaceUser.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WorkspaceUser.prototype, "workspaceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workspace_entity_1.Workspace, (workspace) => workspace.workspaceUsers),
    (0, typeorm_1.Index)(),
    __metadata("design:type", workspace_entity_1.Workspace)
], WorkspaceUser.prototype, "workspace", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WorkspaceUser.prototype, "createdAt", void 0);
exports.WorkspaceUser = WorkspaceUser = __decorate([
    (0, typeorm_1.Entity)()
], WorkspaceUser);
