import { QueryResultResponse, UserQuestionRequest } from '../types/ai.types';
export declare class AiQueryService {
    /**
     * Main AI Query Orchestrator supporting Two-Stage Gemini Pipeline.
     */
    processUserQuestion(request: UserQuestionRequest): Promise<QueryResultResponse>;
    private buildTextResponse;
    private buildFormattedQueryResponse;
    private buildErrorResponse;
}
export declare const aiQueryService: AiQueryService;
