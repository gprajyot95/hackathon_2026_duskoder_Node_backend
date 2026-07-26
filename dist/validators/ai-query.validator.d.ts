import { z } from 'zod';
export declare const userQuestionSchema: z.ZodObject<{
    body: z.ZodObject<{
        question: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        question: string;
    }, {
        question: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        question: string;
    };
}, {
    body: {
        question: string;
    };
}>;
