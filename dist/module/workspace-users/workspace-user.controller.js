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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const datasource_1 = __importDefault(require("../../datasource"));
const workspace_user_entity_1 = require("./workspace-user.entity");
const auth_1 = require("../../lib/auth");
const workspace_entity_1 = require("../workspaces/workspace.entity");
const user_entity_1 = require("../users/user.entity");
const workspaceUserController = (0, express_1.Router)();
const workspaceUserRepository = datasource_1.default.getRepository(workspace_user_entity_1.WorkspaceUser);
const workspaceRepository = datasource_1.default.getRepository(workspace_entity_1.Workspace);
const userRepository = datasource_1.default.getRepository(user_entity_1.User);
// 複数のユーザーをワークスペースに追加
workspaceUserController.post('/:workspaceId', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workspaceId } = req.params;
        const { userIds } = req.body;
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({ message: 'ユーザーIDの配列が必要です' });
            return;
        }
        // ワークスペースの存在確認
        const workspace = yield workspaceRepository.findOne({
            where: { id: workspaceId },
        });
        if (!workspace) {
            res.status(404).json({ message: 'ワークスペースが見つかりません' });
            return;
        }
        // ユーザーが存在するか確認
        const users = yield userRepository.find({
            where: userIds.map((id) => ({ id })),
        });
        if (users.length !== userIds.length) {
            res.status(400).json({ message: '一部のユーザーが存在しません' });
            return;
        }
        // 既存のワークスペースユーザーを取得
        const existingWorkspaceUsers = yield workspaceUserRepository.find({
            where: userIds.map((userId) => ({
                userId,
                workspaceId,
            })),
        });
        const existingUserIds = existingWorkspaceUsers.map((wu) => wu.userId);
        // まだ追加されていないユーザーIDをフィルタリング
        const newUserIds = userIds.filter((id) => !existingUserIds.includes(id));
        if (newUserIds.length === 0) {
            res.status(400).json({
                message: '指定されたすべてのユーザーは既にワークスペースに追加されています',
            });
            return;
        }
        // 新しいワークスペースユーザーを作成
        const workspaceUsers = newUserIds.map((userId) => ({
            userId,
            workspaceId,
        }));
        const createdWorkspaceUsers = yield workspaceUserRepository.save(workspaceUsers);
        res.status(201).json({
            message: `${createdWorkspaceUsers.length}人のユーザーをワークスペースに追加しました`,
            workspaceUsers: createdWorkspaceUsers,
        });
    }
    catch (error) {
        console.error('ワークスペースユーザー作成エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
exports.default = workspaceUserController;
