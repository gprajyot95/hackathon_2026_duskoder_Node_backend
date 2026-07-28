import { ZodError } from 'zod';
import { BadRequestError } from '../errors/base.error';
export function validate(schema) {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const message = error.errors.map(e => e.message).join(', ');
                next(new BadRequestError(`Validation Error: ${message}`, error.errors));
            }
            else {
                next(error);
            }
        }
    };
}
