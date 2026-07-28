import fs from 'fs';
import path from 'path';
import { logger } from '../config/logger.config';
export class PromptBuilderService {
    cachedInstructionText = null;
    getSystemInstruction() {
        if (this.cachedInstructionText && this.cachedInstructionText.trim().length > 0) {
            return this.cachedInstructionText;
        }
        const instructionPath = path.resolve(__dirname, '../resources/instruction.md');
        try {
            logger.info(`Loading system instruction from resource: ${instructionPath}`);
            this.cachedInstructionText = fs.readFileSync(instructionPath, 'utf-8');
            logger.info(`Successfully loaded instruction.md (${this.cachedInstructionText.length} bytes)`);
            return this.cachedInstructionText;
        }
        catch (e) {
            logger.error(`Failed to load system instruction from ${instructionPath}: ${e.message}`);
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
export const promptBuilderService = new PromptBuilderService();
