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
const user_entity_1 = require("./user.entity");
const auth_1 = require("../../lib/auth");
const typeorm_1 = require("typeorm");
const userController = (0, express_1.Router)();
const userRepository = datasource_1.default.getRepository(user_entity_1.User);
userController.get('/', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword } = req.query;
        if (!keyword || typeof keyword !== 'string') {
            res.status(400).json({ message: '検索キーワードを指定してください' });
            return;
        }
        const users = yield userRepository.find({
            where: [
                {
                    name: (0, typeorm_1.Like)(`%${keyword}%`),
                    id: (0, typeorm_1.Not)(req.currentUser.id),
                },
                {
                    email: (0, typeorm_1.Like)(`%${keyword}%`),
                    id: (0, typeorm_1.Not)(req.currentUser.id),
                },
            ],
            select: ['id', 'name', 'email', 'thumbnailUrl'],
            relations: ['workspaceUsers'],
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error('ユーザー検索エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
exports.default = userController;
