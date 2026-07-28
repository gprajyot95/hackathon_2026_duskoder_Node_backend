"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_query_controller_1 = require("../controllers/ai-query.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const ai_query_validator_1 = require("../validators/ai-query.validator");
const router = (0, express_1.Router)();
router.post('/query', (0, validate_middleware_1.validate)(ai_query_validator_1.userQuestionSchema), (req, res, next) => ai_query_controller_1.aiQueryController.processQuery(req, res, next));
exports.default = router;
