"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiService = exports.GeminiService = void 0;
const genai_1 = require("@google/genai");
const env_config_1 = require("../config/env.config");
const logger_config_1 = require("../config/logger.config");
class GeminiService {
    ai;
    constructor() {
        this.ai = new genai_1.GoogleGenAI({ apiKey: env_config_1.env.GEMINI_API_KEY });
    }
    /**
     * Stage 1: Query Generation Mode using Google GenAI SDK.
     */
    async generateQuery(systemInstruction, schemaMetadata, userQuestion) {
        const model = env_config_1.env.GEMINI_MODEL;
        logger_config_1.logger.info(`[STAGE 1: Query Generation] Constructing request for Gemini model '${model}'...`);
        const userPrompt = `=== DATABASE SCHEMA METADATA (FROM CACHE) ===\n${schemaMetadata}\n=== USER QUESTION ===\n${userQuestion}`;
        try {
            logger_config_1.logger.info(`[STAGE 1: Query Generation] Sending request to Gemini API...`);
            const startTime = Date.now();
            const response = await this.ai.models.generateContent({
                model,
                contents: userPrompt,
                config: {
                    responseMimeType: 'application/json',
                    temperature: 0.1,
                    systemInstruction: systemInstruction ? systemInstruction : undefined,
                },
            });
            const elapsed = Date.now() - startTime;
            logger_config_1.logger.info(`[STAGE 1: Query Generation] Received response from Gemini API in ${elapsed}ms`);
            const responseText = response.text;
            if (responseText && responseText.trim().length > 0) {
                logger_config_1.logger.info(`--------------------------------------------------`);
                logger_config_1.logger.info(`[STAGE 1: Query Generation] RAW GEMINI RESPONSE: ${responseText}`);
                logger_config_1.logger.info(`--------------------------------------------------`);
                return this.parseGeminiResponseText(responseText);
            }
            else {
                logger_config_1.logger.error(`[STAGE 1: Query Generation] Empty response text received from Gemini API`);
                throw new Error('Gemini API returned an empty response.');
            }
        }
        catch (e) {
            const userFriendlyError = this.formatGeminiErrorMessage(e);
            logger_config_1.logger.error(`[STAGE 1: Query Generation] Error calling Gemini API: ${e.message}`);
            throw new Error(userFriendlyError);
        }
    }
    /**
     * Stage 2: Response Generation Mode with Executed SQL & Query Results.
     */
    async generateFormattedResponse(systemInstruction, userQuestion, executedSql, queryResults) {
        const model = env_config_1.env.GEMINI_MODEL;
        logger_config_1.logger.info(`[STAGE 2 DEBUG] Starting Stage 2 request construction for model '${model}'...`);
        const staticRuntimeContext = `Current Execution Mode:\nResponse Generation\n\n` +
            `The SQL query has already been executed.\nDo NOT generate SQL.\nDo NOT modify SQL.\nDo NOT suggest another SQL query.\n` +
            `Your responsibility is only to explain the supplied database result according to the response format defined in instruction.md.\n\n` +
            `=== SYSTEM INSTRUCTION ===`;
        const fullSystemInstruction = `${staticRuntimeContext}\n${systemInstruction || ''}`;
        const rowCount = queryResults ? queryResults.length : 0;
        const jsonResultString = JSON.stringify(queryResults || []);
        const userPrompt = `=== ORIGINAL USER QUESTION ===\n${userQuestion || ''}\n` +
            `=== EXECUTED SQL QUERY ===\n${executedSql || 'N/A'}\n` +
            `=== DATABASE QUERY RESULT (${rowCount} rows) ===\n${jsonResultString}`;
        try {
            logger_config_1.logger.info(`[STAGE 2 DEBUG] Sending Request to Gemini API...`);
            const sdkStart = Date.now();
            const response = await this.ai.models.generateContent({
                model,
                contents: userPrompt,
                config: {
                    responseMimeType: 'application/json',
                    temperature: 0.2,
                    systemInstruction: fullSystemInstruction,
                },
            });
            const sdkDuration = Date.now() - sdkStart;
            logger_config_1.logger.info(`[STAGE 2 DEBUG] Response Received from Gemini API in ${sdkDuration} ms`);
            const responseText = response.text;
            if (responseText && responseText.trim().length > 0) {
                logger_config_1.logger.info(`--------------------------------------------------`);
                logger_config_1.logger.info(`[STAGE 2: Response Generation] RAW GEMINI RESPONSE: ${responseText}`);
                logger_config_1.logger.info(`--------------------------------------------------`);
                return this.parseGeminiResponseText(responseText);
            }
            else {
                logger_config_1.logger.error(`[STAGE 2 DEBUG] Empty response text from Gemini API`);
                throw new Error('Gemini API returned an empty response in Stage 2.');
            }
        }
        catch (e) {
            const userFriendlyError = this.formatGeminiErrorMessage(e);
            logger_config_1.logger.error(`[STAGE 2 DEBUG] Gemini Request Failed: ${e.message}`);
            throw new Error(userFriendlyError);
        }
    }
    /**
     * AI Title Generation for Chat Sessions (2-5 words).
     */
    async generateChatTitle(firstUserQuestion) {
        if (!firstUserQuestion || firstUserQuestion.trim().length === 0) {
            return 'New Chat';
        }
        const model = env_config_1.env.GEMINI_MODEL;
        const systemInstructionText = `Generate a concise chat title (2 to 5 words) that best describes the user's request.\n` +
            `Rules:\n- Maximum 5 words.\n- No punctuation unless necessary.\n- No quotes or markdown.\n- Professional and easy to scan.\n- Do not repeat the full question.\n- Return ONLY the title text.`;
        const userPrompt = `User Question: ${firstUserQuestion}`;
        try {
            logger_config_1.logger.info(`Generating AI chat title via Gemini API for question: '${firstUserQuestion}'`);
            const response = await this.ai.models.generateContent({
                model,
                contents: userPrompt,
                config: {
                    temperature: 0.3,
                    systemInstruction: systemInstructionText,
                },
            });
            const rawTitle = response.text;
            if (rawTitle && rawTitle.trim().length > 0) {
                const cleanTitle = rawTitle.trim().replace(/^["']|["']$/g, '').replace(/\n.*/g, '').trim();
                if (cleanTitle.length > 0 && cleanTitle.split(/\s+/).length <= 8) {
                    logger_config_1.logger.info(`Generated AI chat title: '${cleanTitle}'`);
                    return cleanTitle;
                }
            }
        }
        catch (e) {
            logger_config_1.logger.warn(`AI title generation failed, using fallback: ${e.message}`);
        }
        return this.fallbackTitle(firstUserQuestion);
    }
    fallbackTitle(text) {
        if (!text || text.trim().length === 0)
            return 'New Chat';
        const clean = text.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
        const words = clean.split(/\s+/);
        const count = Math.min(words.length, 4);
        const titleWords = words.slice(0, count).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
        return titleWords.length > 0 ? titleWords.join(' ') : 'New Chat';
    }
    parseGeminiResponseText(responseText) {
        try {
            const cleanJson = this.cleanMarkdownCodeBlocks(responseText);
            return JSON.parse(cleanJson);
        }
        catch (e) {
            logger_config_1.logger.error(`Failed to parse Gemini response JSON: ${e.message}`);
            throw new Error(`Failed to parse response from Gemini API: ${e.message}`);
        }
    }
    cleanMarkdownCodeBlocks(text) {
        if (!text)
            return '';
        let trimmed = text.trim();
        if (trimmed.startsWith('```')) {
            const firstNewline = trimmed.indexOf('\n');
            if (firstNewline !== -1 && trimmed.endsWith('```')) {
                return trimmed.substring(firstNewline + 1, trimmed.length - 3).trim();
            }
        }
        return trimmed;
    }
    formatGeminiErrorMessage(throwable) {
        if (!throwable)
            return 'An error occurred while communicating with Gemini API.';
        const msg = throwable.message || String(throwable);
        const lower = msg.toLowerCase();
        if (lower.includes('429') || lower.includes('resource_exhausted') || lower.includes('quota')) {
            return 'Gemini API quota exceeded. Please try again shortly.';
        }
        if (lower.includes('401') || lower.includes('403') || lower.includes('unauthenticated') || lower.includes('invalid')) {
            return 'Invalid or missing Gemini API Key. Please verify your GEMINI_API_KEY environment variable.';
        }
        if (lower.includes('404') || lower.includes('not_found')) {
            return 'Configured Gemini model was not found.';
        }
        if (lower.includes('timeout') || lower.includes('504')) {
            return 'Gemini API request timed out. Please try again.';
        }
        if (lower.includes('500') || lower.includes('503') || lower.includes('unavailable')) {
            return 'Gemini AI service is temporarily unavailable. Please try again shortly.';
        }
        const sanitized = msg.replace(/key=[A-Za-z0-9_\-]+/g, 'key=***').replace(/Bearer\s+[A-Za-z0-9_\-\.]+/g, 'Bearer ***');
        return `Gemini API error: ${sanitized.length > 150 ? sanitized.substring(0, 150) + '...' : sanitized}`;
    }
}
exports.GeminiService = GeminiService;
exports.geminiService = new GeminiService();
