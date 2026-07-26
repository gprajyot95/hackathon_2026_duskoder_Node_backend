"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSchema = exports.updateRoleSchema = exports.googleAuthSchema = void 0;
const zod_1 = require("zod");
exports.googleAuthSchema = zod_1.z.object({
    body: zod_1.z.record(zod_1.z.any()),
});
exports.updateRoleSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string(),
    }),
    body: zod_1.z.object({
        role: zod_1.z.string().min(1, 'Role must be specified'),
    }),
});
exports.updateStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string(),
    }),
    body: zod_1.z.object({
        status: zod_1.z.string().min(1, 'Status must be specified'),
    }),
});
