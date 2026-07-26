import pg from 'pg';
import { env } from '../config/env.config';
import { logger } from '../config/logger.config';
import { schemaMetadataService } from './schema-metadata.service';

export class PostgresNotificationListenerService {
  private client: pg.Client | null = null;
  private isRunning: boolean = false;
  private lastNotificationTime: number = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;

  public async start(): Promise<void> {
    if (!env.NOTIFICATION_ENABLED) {
      logger.info('PostgreSQL notification listener is disabled via configuration');
      return;
    }

    this.isRunning = true;
    logger.info('Starting PostgreSQL LISTEN service...');
    await this.connectAndListen();
  }

  public async stop(): Promise<void> {
    this.isRunning = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.client) {
      try {
        await this.client.end();
      } catch (ignored) {}
      this.client = null;
    }
    logger.info('PostgreSQL notification listener stopped.');
  }

  private async connectAndListen(): Promise<void> {
    if (!this.isRunning) return;

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
          } else {
            logger.warn('Schema refresh attempt returned false.');
          }
        } catch (e: any) {
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
    } catch (err: any) {
      logger.warn(`Failed to connect PostgreSQL notification listener: ${err.message}. Retrying in ${env.NOTIFICATION_RECONNECT_MS}ms...`);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.client) {
      try { this.client.end(); } catch (ignored) {}
      this.client = null;
    }
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connectAndListen();
    }, env.NOTIFICATION_RECONNECT_MS);
  }
}

export const postgresListenerService = new PostgresNotificationListenerService();
