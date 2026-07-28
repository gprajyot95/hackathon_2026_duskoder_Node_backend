"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./routes/index"));
const request_logger_middleware_1 = require("./middlewares/request-logger.middleware");
const error_handler_middleware_1 = require("./middlewares/error-handler.middleware");
const app = (0, express_1.default)();
// Security & Parsing Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Request Logging Middleware
app.use(request_logger_middleware_1.requestLoggerMiddleware);
// Swagger Documentation UI
try {
    const swaggerPath = path_1.default.resolve(__dirname, '../swagger.yaml');
    const swaggerDocument = yamljs_1.default.load(swaggerPath);
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
    app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
}
catch (e) {
    console.warn(`Could not load swagger.yaml: ${e.message}`);
}
// Master API Routes
app.use(index_1.default);
// Centralized Error Handling Middleware
app.use(error_handler_middleware_1.errorHandlerMiddleware);
exports.default = app;
