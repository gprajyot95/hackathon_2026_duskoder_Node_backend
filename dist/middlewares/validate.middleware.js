"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const base_error_1 = require("../errors/base.error");
function validate(schema) {
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
            if (error instanceof zod_1.ZodError) {
                const message = error.errors.map(e => e.message).join(', ');
                next(new base_error_1.BadRequestError(`Validation Error: ${message}`, error.errors));
            }
            else {
                next(error);
            }
        }
    };
}
