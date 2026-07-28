"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresListenerService = exports.PostgresNotificationListenerService = void 0;
const pg_1 = __importDefault(require("pg"));
const env_config_1 = require("../config/env.config");
const logger_config_1 = require("../config/logger.config");
const schema_metadata_service_1 = require("./schema-metadata.service");
class PostgresNotificationListenerService {
    client = null;
    isRunning = false;
    lastNotificationTime = 0;
    reconnectTimer = null;
    async start() {
        if (!env_config_1.env.NOTIFICATION_ENABLED) {
            logger_config_1.logger.info('PostgreSQL notification listener is disabled via configuration');
            return;
        }
        this.isRunning = true;
        logger_config_1.logger.info('Starting PostgreSQL LISTEN service...');
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
        logger_config_1.logger.info('PostgreSQL notification listener stopped.');
    }
    async connectAndListen() {
        if (!this.isRunning)
            return;
        try {
            this.client = new pg_1.default.Client({ connectionString: env_config_1.env.DATABASE_URL });
            await this.client.connect();
            this.client.on('notification', async (msg) => {
                logger_config_1.logger.info(`Notification received on channel '${msg.channel}': ${msg.payload}`);
                const now = Date.now();
                if (now - this.lastNotificationTime < env_config_1.env.NOTIFICATION_DEBOUNCE_MS) {
                    logger_config_1.logger.info(`Debouncing duplicate PostgreSQL notification (received within ${env_config_1.env.NOTIFICATION_DEBOUNCE_MS}ms window)`);
                    return;
                }
                this.lastNotificationTime = now;
                logger_config_1.logger.info('Received PostgreSQL schema change notification. Refreshing schema metadata...');
                try {
                    const updated = await schema_metadata_service_1.schemaMetadataService.refreshSchemaMetadata();
                    if (updated) {
                        logger_config_1.logger.info('Cache updated successfully via PostgreSQL notification.');
                    }
                    else {
                        logger_config_1.logger.warn('Schema refresh attempt returned false.');
                    }
                }
                catch (e) {
                    logger_config_1.logger.error(`Error refreshing schema metadata during notification: ${e.message}`);
                }
            });
            this.client.on('error', (err) => {
                logger_config_1.logger.warn(`PostgreSQL notification client error: ${err.message}. Reconnecting in ${env_config_1.env.NOTIFICATION_RECONNECT_MS}ms...`);
                this.scheduleReconnect();
            });
            this.client.on('end', () => {
                if (this.isRunning) {
                    logger_config_1.logger.warn(`PostgreSQL notification connection ended. Reconnecting in ${env_config_1.env.NOTIFICATION_RECONNECT_MS}ms...`);
                    this.scheduleReconnect();
                }
            });
            await this.client.query(`LISTEN ${env_config_1.env.NOTIFICATION_CHANNEL}`);
            logger_config_1.logger.info(`Listening on PostgreSQL channel '${env_config_1.env.NOTIFICATION_CHANNEL}'`);
        }
        catch (err) {
            logger_config_1.logger.warn(`Failed to connect PostgreSQL notification listener: ${err.message}. Retrying in ${env_config_1.env.NOTIFICATION_RECONNECT_MS}ms...`);
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
        }, env_config_1.env.NOTIFICATION_RECONNECT_MS);
    }
}
exports.PostgresNotificationListenerService = PostgresNotificationListenerService;
exports.postgresListenerService = new PostgresNotificationListenerService();
