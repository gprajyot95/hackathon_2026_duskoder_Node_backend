import { GeminiResponse } from '../types/ai.types';
export declare class GeminiService {
    private ai;
    constructor();
    /**
     * Stage 1: Query Generation Mode using Google GenAI SDK.
     */
    generateQuery(systemInstruction: string, schemaMetadata: string, userQuestion: string): Promise<GeminiResponse>;
    /**
     * Stage 2: Response Generation Mode with Executed SQL & Query Results.
     */
    generateFormattedResponse(systemInstruction: string, userQuestion: string, executedSql: string, queryResults: Record<string, any>[]): Promise<GeminiResponse>;
    /**
     * AI Title Generation for Chat Sessions (2-5 words).
     */
    generateChatTitle(firstUserQuestion: string): Promise<string>;
    private fallbackTitle;
    private parseGeminiResponseText;
    private cleanMarkdownCodeBlocks;
    private formatGeminiErrorMessage;
}
export declare const geminiService: GeminiService;
