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
const auth_1 = require("../../lib/auth");
const file_uploader_1 = require("../../lib/file-uploader");
const accountController = (0, express_1.Router)();
const userRepository = datasource_1.default.getRepository(user_entity_1.User);
accountController.put('/profile', auth_1.Auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.currentUser.id;
        const user = yield userRepository.findOne({
            where: { id: userId },
        });
        if (user == null) {
            res.status(404).json({ message: 'ユーザーが見つかりません' });
            return;
        }
        const { fileUrl, body } = yield (0, file_uploader_1.upload)(req, res, 'account');
        const updatedUser = yield userRepository.save(Object.assign(Object.assign({}, user), { name: body.name, thumbnailUrl: fileUrl !== null && fileUrl !== void 0 ? fileUrl : user.thumbnailUrl }));
        // パスワードを除いたユーザー情報を返す
        const { password } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
        res.status(200).json(userWithoutPassword);
    }
    catch (error) {
        console.error('プロフィール更新エラー:', error);
        res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
}));
exports.default = accountController;
