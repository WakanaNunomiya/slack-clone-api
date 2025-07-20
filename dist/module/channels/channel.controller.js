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
const channel_entity_1 = require("./channel.entity");
const auth_1 = require("../../lib/auth");
const workspace_user_entity_1 = require("../workspace-users/workspace-user.entity");
const channelController = (0, express_1.Router)();
const channelRepository = datasource_1.default.getRepository(channel_entity_1.Channel);
const workspaceUserRepository = datasource_1.default.getRepository(workspace_user_entity_1.WorkspaceUser);
// ワークスペース内のすべてのチャンネルを取得
channelController.get('/:workspaceId', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workspaceId } = req.params;
        const channels = yield channelRepository.find({
            where: { workspaceId },
            order: { createdAt: 'ASC' },
        });
        res.status(200).json(channels);
    }
    catch (error) {
        console.error('チャンネル取得エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// 特定のチャンネルを取得
channelController.get('/:id', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const channel = yield channelRepository.findOne({
            where: { id },
        });
        if (!channel) {
            res.status(404).json({ message: 'チャンネルが見つかりません' });
            return;
        }
        res.status(200).json(channel);
    }
    catch (error) {
        console.error('チャンネル取得エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// チャンネルを作成
channelController.post('/', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, workspaceId } = req.body;
        if (!name) {
            res.status(400).json({ message: 'チャンネル名は必須です' });
            return;
        }
        if (!workspaceId) {
            res.status(400).json({ message: 'ワークスペースIDは必須です' });
            return;
        }
        const channel = yield channelRepository.save({
            name,
            workspaceId,
        });
        res.status(201).json(channel);
    }
    catch (error) {
        console.error('チャンネル作成エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// チャンネルを削除
channelController.delete('/:id', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingChannel = yield channelRepository.findOne({
            where: { id },
        });
        if (!existingChannel) {
            res.status(404).json({ message: 'チャンネルが見つかりません' });
            return;
        }
        // ユーザーがワークスペースに所属しているか確認
        const isWorkspaceMember = yield workspaceUserRepository.findOne({
            where: {
                workspaceId: existingChannel.workspaceId,
                userId: req.currentUser.id,
            },
        });
        if (!isWorkspaceMember) {
            res
                .status(403)
                .json({ message: 'このチャンネルを削除する権限がありません' });
            return;
        }
        // ワークスペース内のチャンネル数を確認
        const channelCount = yield channelRepository.count({
            where: { workspaceId: existingChannel.workspaceId },
        });
        // チャンネルが1つしかない場合は削除できないようにする
        if (channelCount <= 1) {
            res.status(400).json({
                message: 'ワークスペースには少なくとも1つのチャンネルが必要です',
            });
            return;
        }
        yield channelRepository.delete(id);
        res.status(200).json({ message: 'チャンネルを削除しました' });
    }
    catch (error) {
        console.error('チャンネル削除エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
exports.default = channelController;
