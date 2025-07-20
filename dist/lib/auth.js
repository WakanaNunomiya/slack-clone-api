"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const Auth = (req, _, next) => {
    if (req.currentUser == null)
        return next(new Error('Unauthorized user'));
    next();
};
exports.Auth = Auth;
