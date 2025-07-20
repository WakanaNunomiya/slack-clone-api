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
exports.Workspace = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const channel_entity_1 = require("../channels/channel.entity");
const workspace_user_entity_1 = require("../workspace-users/workspace-user.entity");
let Workspace = class Workspace {
};
exports.Workspace = Workspace;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Workspace.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Workspace.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Workspace.prototype, "adminUserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (adminUser) => adminUser.adminWorkspaces),
    (0, typeorm_1.Index)(),
    __metadata("design:type", user_entity_1.User)
], Workspace.prototype, "adminUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channel_entity_1.Channel, (channel) => channel.workspace),
    __metadata("design:type", Array)
], Workspace.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workspace_user_entity_1.WorkspaceUser, (obj) => obj.workspace, { cascade: true }),
    __metadata("design:type", Array)
], Workspace.prototype, "workspaceUsers", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Workspace.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Workspace.prototype, "updatedAt", void 0);
exports.Workspace = Workspace = __decorate([
    (0, typeorm_1.Entity)()
], Workspace);
