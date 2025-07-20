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
const workspace_entity_1 = require("./workspace.entity");
const auth_1 = require("../../lib/auth");
const workspace_user_entity_1 = require("../workspace-users/workspace-user.entity");
const channel_entity_1 = require("../channels/channel.entity");
const workSpaceController = (0, express_1.Router)();
const workspaceRepository = datasource_1.default.getRepository(workspace_entity_1.Workspace);
const workspaceUserRepository = datasource_1.default.getRepository(workspace_user_entity_1.WorkspaceUser);
const channelRepository = datasource_1.default.getRepository(channel_entity_1.Channel);
// ユーザーが所属するワークスペースを取得
workSpaceController.get('/', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workspaces = yield workspaceRepository.find({
            where: { workspaceUsers: { userId: req.currentUser.id } },
            relations: ['workspaceUsers', 'channels'],
        });
        res.status(200).json(workspaces);
    }
    catch (error) {
        console.error('ワークスペース取得エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// 特定のワークスペースを取得
workSpaceController.get('/:id', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const workspace = yield workspaceRepository.findOne({
            where: { id },
        });
        if (!workspace) {
            res.status(404).json({ message: 'ワークスペースが見つかりません' });
            return;
        }
        res.status(200).json(workspace);
    }
    catch (error) {
        console.error('ワークスペース取得エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// ワークスペースを作成
workSpaceController.post('/', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ message: 'ワークスペース名は必須です' });
            return;
        }
        // ワークスペースを作成
        const workspace = yield workspaceRepository.save({
            name,
            adminUserId: req.currentUser.id,
        });
        // 最初の一つのチャンネルを作成
        const channel = yield channelRepository.save({
            name: 'general',
            workspaceId: workspace.id,
        });
        // 作成者をワークスペースのメンバーとして追加
        yield workspaceUserRepository.save({
            userId: req.currentUser.id,
            workspaceId: workspace.id,
        });
        res.status(201).json(Object.assign(Object.assign({}, workspace), { channels: [channel] }));
    }
    catch (error) {
        console.error('ワークスペース作成エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// ワークスペースを更新
workSpaceController.patch('/:id', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ message: 'ワークスペース名は必須です' });
            return;
        }
        const existingWorkspace = yield workspaceRepository.findOne({
            where: { id, adminUserId: req.currentUser.id },
        });
        if (!existingWorkspace) {
            res.status(404).json({ message: 'ワークスペースが見つかりません' });
            return;
        }
        yield workspaceRepository.update(id, { name });
        const workspace = yield workspaceRepository.findOne({
            where: { id },
        });
        res.status(200).json(workspace);
    }
    catch (error) {
        console.error('ワークスペース更新エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// ワークスペースを削除
workSpaceController.delete('/:id', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingWorkspace = yield workspaceRepository.findOne({
            where: { id, adminUserId: req.currentUser.id },
        });
        if (!existingWorkspace) {
            res.status(404).json({ message: 'ワークスペースが見つかりません' });
            return;
        }
        yield workspaceRepository.delete(id);
        res.status(200).json({ message: 'ワークスペースを削除しました' });
    }
    catch (error) {
        console.error('ワークスペース削除エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
exports.default = workSpaceController;
