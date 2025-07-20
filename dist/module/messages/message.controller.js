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
const message_entity_1 = require("./message.entity");
const auth_1 = require("../../lib/auth");
const channel_entity_1 = require("../channels/channel.entity");
const file_uploader_1 = require("../../lib/file-uploader");
const index_1 = require("../../index");
const messageController = (0, express_1.Router)();
const messageRepository = datasource_1.default.getRepository(message_entity_1.Message);
const channelRepository = datasource_1.default.getRepository(channel_entity_1.Channel);
// チャンネル内のすべてのメッセージを取得
messageController.get('/:workspaceId/:channelId', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workspaceId, channelId } = req.params;
        const messages = yield messageRepository.find({
            where: { channelId, channel: { workspaceId } },
            relations: ['user', 'channel'],
            order: { createdAt: 'DESC' },
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.error('メッセージ取得エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// メッセージを作成
messageController.post('/:workspaceId/:channelId', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const { workspaceId, channelId } = req.params;
        const existingChannel = yield channelRepository.findOne({
            where: {
                id: channelId,
                workspaceId,
                workspace: { workspaceUsers: { userId: req.currentUser.id } },
            },
            relations: ['workspace', 'workspace.workspaceUsers'],
        });
        if (existingChannel == null) {
            res.status(404).json({ message: 'チャンネルが見つかりません' });
            return;
        }
        if (!content) {
            res.status(400).json({ message: 'メッセージ内容は必須です' });
            return;
        }
        const message = yield messageRepository.save({
            content,
            channelId,
            userId: req.currentUser.id,
        });
        const newMessage = yield messageRepository.findOne({
            where: { id: message.id },
            relations: ['user'],
        });
        // Socket.IOを使用してリアルタイムで新しいメッセージを全体に配信
        index_1.io.emit('new-message', newMessage);
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error('メッセージ作成エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// 画像アップロードエンドポイント
messageController.post('/:workspaceId/:channelId/image', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { workspaceId, channelId } = req.params;
        const existingChannel = yield channelRepository.findOne({
            where: {
                id: channelId,
                workspaceId,
                workspace: { workspaceUsers: { userId: req.currentUser.id } },
            },
            relations: ['workspace', 'workspace.workspaceUsers'],
        });
        if (existingChannel == null) {
            res.status(404).json({ message: 'チャンネルが見つかりません' });
            return;
        }
        const { fileUrl } = yield (0, file_uploader_1.upload)(req, res, 'messages');
        if (fileUrl == null) {
            res.status(400).json({ message: '画像がアップロードされていません' });
            return;
        }
        const message = yield messageRepository.save({
            channelId,
            userId: req.currentUser.id,
            imageUrl: fileUrl,
        });
        const messageWithUser = Object.assign(Object.assign({}, message), { user: req.currentUser });
        // Socket.IOを使用してリアルタイムで新しい画像メッセージを全体に配信
        index_1.io.emit('new-message', messageWithUser);
        res.status(201).json(messageWithUser);
    }
    catch (error) {
        console.error('画像アップロードエラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// メッセージを削除
messageController.delete('/:id', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingMessage = yield messageRepository.findOne({
            where: { id, userId: req.currentUser.id },
            relations: ['channel'],
        });
        if (!existingMessage) {
            res.status(404).json({ message: 'メッセージが見つかりません' });
            return;
        }
        yield messageRepository.delete(id);
        // Socket.IOを使用してリアルタイムでメッセージ削除を全体に配信
        index_1.io.emit('delete-message', id);
        res.status(200).json({ status: true });
    }
    catch (error) {
        console.error('メッセージ削除エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
exports.default = messageController;
