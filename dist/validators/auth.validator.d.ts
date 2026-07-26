import { z } from 'zod';
export declare const googleAuthSchema: z.ZodObject<{
    body: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    body: Record<string, any>;
}, {
    body: Record<string, any>;
}>;
export declare const updateRoleSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userId: string;
    }, {
        userId: string;
    }>;
    body: z.ZodObject<{
        role: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: string;
    }, {
        role: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        userId: string;
    };
    body: {
        role: string;
    };
}, {
    params: {
        userId: string;
    };
    body: {
        role: string;
    };
}>;
export declare const updateStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userId: string;
    }, {
        userId: string;
    }>;
    body: z.ZodObject<{
        status: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: string;
    }, {
        status: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        userId: string;
    };
    body: {
        status: string;
    };
}, {
    params: {
        userId: string;
    };
    body: {
        status: string;
    };
}>;
