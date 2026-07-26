"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_config_1 = require("./config/env.config");
const logger_config_1 = require("./config/logger.config");
const schema_metadata_service_1 = require("./services/schema-metadata.service");
const postgres_listener_service_1 = require("./services/postgres-listener.service");
const user_repository_1 = require("./repositories/user.repository");
async function bootstrap() {
    try {
        logger_config_1.logger.info('========================================================================');
        logger_config_1.logger.info('Starting Production-Grade Node.js TypeScript Backend Server...');
        logger_config_1.logger.info('========================================================================');
        // 1. Initialize Admin User in DB
        try {
            await user_repository_1.userRepository.ensureAdminUserExists();
        }
        catch (e) {
            logger_config_1.logger.warn(`Could not ensure admin user exists: ${e.message}`);
        }
        // 2. Startup Schema Fetch & Cache Population (CommandLineRunner equivalent)
        if (env_config_1.env.FETCH_ON_STARTUP) {
            logger_config_1.logger.info('----------------------------------------------------------------------');
            logger_config_1.logger.info('STARTUP TASK: Fetching PostgreSQL schema metadata & initializing cache...');
            logger_config_1.logger.info('----------------------------------------------------------------------');
            const success = await schema_metadata_service_1.schemaMetadataService.refreshSchemaMetadata();
            if (success) {
                logger_config_1.logger.info('STARTUP TASK COMPLETED: Initial database schema loaded into cache successfully.');
            }
            else {
                logger_config_1.logger.warn('STARTUP TASK WARNING: Could not populate schema metadata on startup.');
            }
        }
        // 3. Start PostgreSQL LISTEN/NOTIFY Service
        await postgres_listener_service_1.postgresListenerService.start();
        // 4. Listen on HTTP Port
        const server = app_1.default.listen(env_config_1.env.PORT, () => {
            logger_config_1.logger.info(`🚀 Server running in '${env_config_1.env.NODE_ENV}' mode on http://localhost:${env_config_1.env.PORT}`);
            logger_config_1.logger.info(`📚 Swagger Documentation available at http://localhost:${env_config_1.env.PORT}/docs`);
        });
        // Graceful Shutdown Handling
        const shutdown = async (signal) => {
            logger_config_1.logger.info(`Received ${signal}. Shutting down gracefully...`);
            server.close(async () => {
                await postgres_listener_service_1.postgresListenerService.stop();
                logger_config_1.logger.info('HTTP server closed. Exiting process.');
                process.exit(0);
            });
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        logger_config_1.logger.error(`Fatal startup error: ${error.message}`);
        process.exit(1);
    }
}
bootstrap();
