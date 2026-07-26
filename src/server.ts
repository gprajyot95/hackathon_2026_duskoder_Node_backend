import app from './app';
import { env } from './config/env.config';
import { logger } from './config/logger.config';
import { schemaMetadataService } from './services/schema-metadata.service';
import { postgresListenerService } from './services/postgres-listener.service';
import { userRepository } from './repositories/user.repository';

async function bootstrap() {
  try {
    logger.info('========================================================================');
    logger.info('Starting Production-Grade Node.js TypeScript Backend Server...');
    logger.info('========================================================================');

    // 1. Initialize Admin User in DB
    try {
      await userRepository.ensureAdminUserExists();
    } catch (e: any) {
      logger.warn(`Could not ensure admin user exists: ${e.message}`);
    }

    // 2. Startup Schema Fetch & Cache Population (CommandLineRunner equivalent)
    if (env.FETCH_ON_STARTUP) {
      logger.info('----------------------------------------------------------------------');
      logger.info('STARTUP TASK: Fetching PostgreSQL schema metadata & initializing cache...');
      logger.info('----------------------------------------------------------------------');
      const success = await schemaMetadataService.refreshSchemaMetadata();
      if (success) {
        logger.info('STARTUP TASK COMPLETED: Initial database schema loaded into cache successfully.');
      } else {
        logger.warn('STARTUP TASK WARNING: Could not populate schema metadata on startup.');
      }
    }

    // 3. Start PostgreSQL LISTEN/NOTIFY Service
    await postgresListenerService.start();

    // 4. Listen on HTTP Port
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running in '${env.NODE_ENV}' mode on http://localhost:${env.PORT}`);
      logger.info(`📚 Swagger Documentation available at http://localhost:${env.PORT}/docs`);
    });

    // Graceful Shutdown Handling
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await postgresListenerService.stop();
        logger.info('HTTP server closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error: any) {
    logger.error(`Fatal startup error: ${error.message}`);
    process.exit(1);
  }
}

bootstrap();
