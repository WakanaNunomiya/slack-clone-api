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
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const datasource_1 = __importDefault(require("./datasource"));
const workspace_controller_1 = __importDefault(require("./module/workspaces/workspace.controller"));
const auth_controller_1 = __importDefault(require("./module/auth/auth.controller"));
const set_current_user_1 = __importDefault(require("./middleware/set-current-user"));
const channel_controller_1 = __importDefault(require("./module/channels/channel.controller"));
const message_controller_1 = __importDefault(require("./module/messages/message.controller"));
const account_controller_1 = __importDefault(require("./module/account/account.controller"));
const workspace_user_controller_1 = __importDefault(require("./module/workspace-users/workspace-user.controller"));
const user_controller_1 = __importDefault(require("./module/users/user.controller"));
require("dotenv").config();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// 環境変数からオリジンを取得
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: CLIENT_ORIGIN,
        methods: ["GET", "POST"],
    },
});
exports.io = io;
// JSONミドルウェアの設定
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: CLIENT_ORIGIN }));
app.use(set_current_user_1.default);
// 静的ファイル配信の設定
app.use("/uploads", express_1.default.static("uploads"));
// ルートの設定
app.use("/auth", auth_controller_1.default);
app.use("/account", account_controller_1.default);
app.use("/workspaces", workspace_controller_1.default);
app.use("/channels", channel_controller_1.default);
app.use("/messages", message_controller_1.default);
app.use("/workspace-users", workspace_user_controller_1.default);
app.use("/users", user_controller_1.default);
io.on("connection", (socket) => {
    console.log("クライアント接続: ", socket.id);
    socket.on("disconnect", () => {
        console.log("クライアント切断: ", socket.id);
    });
});
datasource_1.default
    .initialize()
    .then((connection) => __awaiter(void 0, void 0, void 0, function* () {
    httpServer.listen({ port: Number(port), host: "0.0.0.0" }, () => {
        console.log(`Server listening on port ${port}!`);
    });
}))
    .catch((error) => console.error(error));
app.get("/", (req, res) => {
    res.send("hello world");
});
