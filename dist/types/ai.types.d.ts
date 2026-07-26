export interface GeminiResponse {
    type?: string;
    requiresDatabase?: boolean;
    confidence?: number;
    title?: string;
    summary?: string;
    answer?: string;
    sql?: string;
    query?: string;
    sqlQuery?: string;
    highlights?: string[];
    relatedObjects?: any;
    relatedTables?: any;
    relatedColumns?: any;
    resultSummary?: any;
    tableSummary?: any;
    suggestedFollowupQuestions?: string[];
    nextSuggestions?: string[];
    visualizationHint?: string;
    visualizationHints?: any;
    visualization?: any;
    response?: {
        answer?: string;
        highlights?: string[];
        relatedTables?: any;
        relatedColumns?: any;
        tableSummary?: any;
        nextSuggestions?: string[];
    };
}
export interface UserQuestionRequest {
    question: string;
}
export interface QueryResultResponse {
    type?: string;
    requiresDatabase?: boolean;
    confidence?: number;
    question?: string;
    title?: string;
    summary?: string;
    answer?: string;
    highlights?: string[];
    relatedObjects?: any;
    resultSummary?: any;
    suggestedFollowupQuestions?: string[];
    visualizationHint?: string;
    sql?: string;
    data?: Record<string, any>[];
    rowCount?: number;
    executionTimeMs?: number;
    error?: string;
}
