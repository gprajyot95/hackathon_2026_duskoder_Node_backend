import pg from 'pg';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';
import { schemaMetadataService } from './schema-metadata.service';
export class PostgresNotificationListenerService {
    client = null;
    isRunning = false;
    lastNotificationTime = 0;
    reconnectTimer = null;
    async start() {
        if (!env.NOTIFICATION_ENABLED) {
            logger.info('PostgreSQL notification listener is disabled via configuration');
            return;
        }
        this.isRunning = true;
        logger.info('Starting PostgreSQL LISTEN service...');
        await this.connectAndListen();
    }
    async stop() {
        this.isRunning = false;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.client) {
            try {
                await this.client.end();
            }
            catch (ignored) { }
            this.client = null;
        }
        logger.info('PostgreSQL notification listener stopped.');
    }
    async connectAndListen() {
        if (!this.isRunning)
            return;
        try {
            this.client = new pg.Client({ connectionString: env.DATABASE_URL });
            await this.client.connect();
            this.client.on('notification', async (msg) => {
                logger.info(`Notification received on channel '${msg.channel}': ${msg.payload}`);
                const now = Date.now();
                if (now - this.lastNotificationTime < env.NOTIFICATION_DEBOUNCE_MS) {
                    logger.info(`Debouncing duplicate PostgreSQL notification (received within ${env.NOTIFICATION_DEBOUNCE_MS}ms window)`);
                    return;
                }
                this.lastNotificationTime = now;
                logger.info('Received PostgreSQL schema change notification. Refreshing schema metadata...');
                try {
                    const updated = await schemaMetadataService.refreshSchemaMetadata();
                    if (updated) {
                        logger.info('Cache updated successfully via PostgreSQL notification.');
                    }
                    else {
                        logger.warn('Schema refresh attempt returned false.');
                    }
                }
                catch (e) {
                    logger.error(`Error refreshing schema metadata during notification: ${e.message}`);
                }
            });
            this.client.on('error', (err) => {
                logger.warn(`PostgreSQL notification client error: ${err.message}. Reconnecting in ${env.NOTIFICATION_RECONNECT_MS}ms...`);
                this.scheduleReconnect();
            });
            this.client.on('end', () => {
                if (this.isRunning) {
                    logger.warn(`PostgreSQL notification connection ended. Reconnecting in ${env.NOTIFICATION_RECONNECT_MS}ms...`);
                    this.scheduleReconnect();
                }
            });
            await this.client.query(`LISTEN ${env.NOTIFICATION_CHANNEL}`);
            logger.info(`Listening on PostgreSQL channel '${env.NOTIFICATION_CHANNEL}'`);
        }
        catch (err) {
            logger.warn(`Failed to connect PostgreSQL notification listener: ${err.message}. Retrying in ${env.NOTIFICATION_RECONNECT_MS}ms...`);
            this.scheduleReconnect();
        }
    }
    scheduleReconnect() {
        if (this.client) {
            try {
                this.client.end();
            }
            catch (ignored) { }
            this.client = null;
        }
        if (this.reconnectTimer)
            clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
            this.connectAndListen();
        }, env.NOTIFICATION_RECONNECT_MS);
    }
}
export const postgresListenerService = new PostgresNotificationListenerService();
