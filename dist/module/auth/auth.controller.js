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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const datasource_1 = __importDefault(require("../../datasource"));
const user_entity_1 = require("../users/user.entity");
const bcryptjs_1 = require("bcryptjs");
const jwt_1 = require("../../lib/jwt");
const authController = (0, express_1.Router)();
const userRepository = datasource_1.default.getRepository(user_entity_1.User);
// ユーザー登録
authController.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: '名前、メール、パスワードは必須です' });
            return;
        }
        // メールアドレスの重複チェック
        const existingUser = yield userRepository.findOne({ where: { email } });
        if (existingUser) {
            res
                .status(400)
                .json({ message: 'このメールアドレスは既に使用されています' });
            return;
        }
        // パスワードのハッシュ化
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
        // ユーザー作成
        const user = yield userRepository.save({
            name,
            email,
            password: hashedPassword,
        });
        const token = (0, jwt_1.encodeJwt)(user.id);
        // パスワードを除外してレスポンスを返す
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(200).json({ user: userWithoutPassword, token });
    }
    catch (error) {
        console.error('ユーザー登録エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// ログイン
authController.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // 必須項目のバリデーション
        if (!email || !password) {
            res.status(400).json({ message: 'メールとパスワードは必須です' });
            return;
        }
        // ユーザーの検索
        const user = yield userRepository.findOne({ where: { email } });
        if (!user) {
            res
                .status(401)
                .json({ message: 'メールアドレスまたはパスワードが正しくありません' });
            return;
        }
        // パスワードの確認
        const isPasswordValid = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!isPasswordValid) {
            res
                .status(401)
                .json({ message: 'メールアドレスまたはパスワードが正しくありません' });
            return;
        }
        // JWTトークンの生成
        const token = (0, jwt_1.encodeJwt)(user.id);
        // パスワードを除外してレスポンスを返す
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.status(200).json({ user: userWithoutPassword, token });
    }
    catch (error) {
        console.error('ログインエラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
// 現在のユーザー情報取得
authController.get('/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.currentUser == null) {
            res.status(200).json(null);
            return;
        }
        const _a = req.currentUser, { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
        res.status(200).json(userWithoutPassword);
    }
    catch (error) {
        console.error('ユーザー情報取得エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
exports.default = authController;
