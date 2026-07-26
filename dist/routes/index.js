"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_routes_1 = __importDefault(require("./data.routes"));
const ai_query_routes_1 = __importDefault(require("./ai-query.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const chat_routes_1 = __importDefault(require("./chat.routes"));
const masterRouter = (0, express_1.Router)();
masterRouter.use('/api', data_routes_1.default);
masterRouter.use('/api', auth_routes_1.default);
masterRouter.use('/api/ai', ai_query_routes_1.default);
masterRouter.use('/api/chat', chat_routes_1.default);
exports.default = masterRouter;
