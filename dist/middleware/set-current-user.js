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
const datasource_1 = __importDefault(require("../datasource"));
const user_entity_1 = require("../module/users/user.entity");
const jwt_1 = require("../lib/jwt");
exports.default = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = _getTokenFromHeader(req);
    if (!token)
        return next();
    try {
        const id = (0, jwt_1.decodeJwt)(token);
        const userRepository = datasource_1.default.getRepository(user_entity_1.User);
        const user = yield userRepository.findOne({ where: { id } });
        if (!user)
            return next();
        req.currentUser = user;
    }
    catch (e) {
        throw new Error('Unauthorized');
    }
    next();
});
const _getTokenFromHeader = (req) => {
    if (req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
};
