"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptBuilderService = exports.PromptBuilderService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_config_1 = require("../config/logger.config");
class PromptBuilderService {
    cachedInstructionText = null;
    getSystemInstruction() {
        if (this.cachedInstructionText && this.cachedInstructionText.trim().length > 0) {
            return this.cachedInstructionText;
        }
        const instructionPath = path_1.default.resolve(__dirname, '../resources/instruction.md');
        try {
            logger_config_1.logger.info(`Loading system instruction from resource: ${instructionPath}`);
            this.cachedInstructionText = fs_1.default.readFileSync(instructionPath, 'utf-8');
            logger_config_1.logger.info(`Successfully loaded instruction.md (${this.cachedInstructionText.length} bytes)`);
            return this.cachedInstructionText;
        }
        catch (e) {
            logger_config_1.logger.error(`Failed to load system instruction from ${instructionPath}: ${e.message}`);
            throw new Error(`Could not load system instruction file: ${instructionPath}`);
        }
    }
    buildUserPrompt(schemaMetadata, userQuestion) {
        return (`=== DATABASE SCHEMA METADATA (FROM CACHE) ===\n` +
            `${schemaMetadata || 'NO_SCHEMA_AVAILABLE'}\n\n` +
            `=== USER QUESTION ===\n` +
            `${userQuestion || ''}\n\n` +
            `Analyze the schema metadata and user question according to system instructions and return valid JSON.`);
    }
}
exports.PromptBuilderService = PromptBuilderService;
exports.promptBuilderService = new PromptBuilderService();
