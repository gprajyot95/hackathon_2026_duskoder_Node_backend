import { z } from 'zod';
export const userQuestionSchema = z.object({
    body: z.object({
        question: z.string().min(1, 'Question must not be empty.'),
    }),
});
