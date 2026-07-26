"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQuestionSchema = void 0;
const zod_1 = require("zod");
exports.userQuestionSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z.string().min(1, 'Question must not be empty.'),
    }),
});
